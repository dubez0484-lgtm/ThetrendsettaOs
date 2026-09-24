import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { getLmCampaignBySlug } from "@/lib/lead-magnet-public.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Download, Loader2, Mail, Sparkles } from "lucide-react";

type FieldCfg = { key: string; label?: string; required?: boolean; type?: string; placeholder?: string };

export const Route = createFileRoute("/lm/$slug")({
  loader: async ({ params }) => await getLmCampaignBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    const title = loaderData?.campaign?.headline ?? "Free download";
    const description =
      loaderData?.campaign?.subheadline ?? "Grab this free resource from THETRENDSETTA.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PublicLeadMagnet,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[420px] rounded-full bg-secondary/20 blur-[140px]" />
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 py-16">
        {children}
        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Powered by <span className="text-gradient font-semibold">TRENDSETTA SYSTEM™</span>
        </footer>
      </div>
    </div>
  );
}

function PublicLeadMagnet() {
  const loaded = Route.useLoaderData();

  if (!loaded) {
    return (
      <Shell>
        <div className="glass-card w-full rounded-2xl border border-white/10 p-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Page not available</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This lead magnet isn't active or the link is incorrect.
          </p>
          <Link to="/" className="mt-6 inline-block text-sm text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </Shell>
    );
  }

  return <CaptureForm data={loaded} />;
}

function CaptureForm({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getLmCampaignBySlug>>>;
}) {
  const { campaign, doc } = data;
  const fields = useMemo<FieldCfg[]>(() => {
    const raw = Array.isArray(campaign.fields) ? (campaign.fields as FieldCfg[]) : [];
    const list = raw.filter((f) => f && typeof f.key === "string");
    if (!list.some((f) => f.key === "email")) {
      list.unshift({ key: "email", label: "Email", required: true, type: "email" });
    }
    return list;
  }, [campaign.fields]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "confirm" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const sessionId = useRef("");
  const tracked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let sid = localStorage.getItem("ts_sid");
    if (!sid) {
      sid = Math.random().toString(36).slice(2);
      localStorage.setItem("ts_sid", sid);
    }
    sessionId.current = sid;
    if (tracked.current) return;
    tracked.current = true;
    supabase
      .from("lm_events")
      .insert({
        campaign_id: campaign.id,
        event_type: "view",
        session_id: sid,
        metadata: { path: window.location.pathname, referrer: document.referrer || null },
      })
      .then(() => {});
  }, [campaign.id]);

  const utm = () => {
    if (typeof window === "undefined") return {};
    const p = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const v = p.get(k);
      if (v) out[k] = v.slice(0, 200);
    }
    return out;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = (values.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      setError("Please enter a valid email address.");
      return;
    }
    for (const f of fields) {
      if (f.required && f.key !== "email" && !(values[f.key] ?? "").trim()) {
        setError(`${f.label || f.key} is required.`);
        return;
      }
    }

    setStatus("loading");
    const custom: Record<string, string> = {};
    for (const f of fields) {
      if (f.key === "email" || f.key === "name") continue;
      const v = (values[f.key] ?? "").trim();
      if (v) custom[f.key] = v.slice(0, 500);
    }

    const { error: insErr } = await supabase.from("lm_leads").insert({
      campaign_id: campaign.id,
      email,
      name: (values.name ?? "").trim().slice(0, 120) || null,
      custom_fields: custom,
      source: typeof window !== "undefined" ? window.location.hostname : null,
      utm: utm(),
      confirmed: !campaign.require_email_confirm,
    });

    // 23505 = duplicate (campaign_id, email) → treat as successful re-submit
    if (insErr && (insErr as { code?: string }).code !== "23505") {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
      return;
    }

    supabase
      .from("lm_events")
      .insert({
        campaign_id: campaign.id,
        event_type: "submit",
        session_id: sessionId.current,
        metadata: { email_domain: email.split("@")[1] ?? null },
      })
      .then(() => {});

    setStatus(campaign.require_email_confirm ? "confirm" : "done");
  };

  if (status === "confirm" || status === "done") {
    return (
      <Shell>
        <div className="glass-card w-full rounded-2xl border border-white/10 p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
            {status === "confirm" ? <Mail className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
          </div>
          {status === "confirm" ? (
            <>
              <h1 className="mt-5 text-2xl font-bold tracking-tight">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent you a confirmation link. Confirm your email to unlock the download.
              </p>
            </>
          ) : doc?.pdf_url ? (
            <>
              <h1 className="mt-5 text-2xl font-bold tracking-tight">You're in — here it is</h1>
              <p className="mt-2 text-sm text-muted-foreground">{doc.title}</p>
              <Button asChild className="mt-6 w-full" size="lg">
                <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Download now
                </a>
              </Button>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-2xl font-bold tracking-tight">You're on the list</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your download is on its way — check your inbox shortly.
              </p>
            </>
          )}
          <Link to="/" className="mt-6 inline-block text-xs text-muted-foreground hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="glass-card w-full rounded-2xl border border-white/10 p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3 w-3" /> Free resource
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight">{campaign.headline}</h1>
        {campaign.subheadline && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{campaign.subheadline}</p>
        )}

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={`f-${f.key}`} className="text-xs uppercase tracking-wider text-muted-foreground">
                {f.label || f.key}
                {f.required ? " *" : ""}
              </Label>
              <Input
                id={`f-${f.key}`}
                type={f.key === "email" ? "email" : f.type === "tel" ? "tel" : "text"}
                maxLength={f.key === "email" ? 255 : 500}
                placeholder={f.placeholder || (f.key === "email" ? "you@email.com" : undefined)}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="bg-white/5"
              />
            </div>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              campaign.cta_label
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </Shell>
  );
}
