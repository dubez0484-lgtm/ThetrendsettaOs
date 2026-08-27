import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { getPublishedBySlug } from "@/lib/funnels.functions";
import { SectionRenderer } from "@/components/funnel/SectionRenderer";
import type { Section } from "@/components/funnel/sections";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/f/$slug")({
  loader: async ({ params }) => {
    const f = await getPublishedBySlug({ data: { slug: params.slug } });
    if (!f) throw notFound();
    return { funnel: f };
  },
  head: ({ loaderData }) => {
    const seo = (loaderData?.funnel?.seo as any) ?? {};
    const title = seo.title || loaderData?.funnel?.name || "Funnel";
    const description = seo.description || "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PublicFunnel,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Funnel not found</h1>
        <p className="text-sm text-muted-foreground mt-2">This funnel is not published or doesn't exist.</p>
      </div>
    </div>
  ),
});

function PublicFunnel() {
  const { funnel } = Route.useLoaderData();
  const sections = (funnel.sections as Section[]) ?? [];
  const sessionId = useRef<string>("");
  const tracked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let sid = localStorage.getItem("ts_sid");
    if (!sid) { sid = Math.random().toString(36).slice(2); localStorage.setItem("ts_sid", sid); }
    sessionId.current = sid;
    if (tracked.current) return;
    tracked.current = true;
    supabase.from("funnel_events").insert({
      funnel_id: funnel.id,
      event_type: "view",
      session_id: sid,
    }).then(() => {});
  }, [funnel.id]);

  const track = (event: "optin" | "click", metadata?: Record<string, unknown>) => {
    supabase.from("funnel_events").insert({
      funnel_id: funnel.id,
      event_type: event,
      session_id: sessionId.current,
      metadata: (metadata ?? {}) as any,
    }).then(() => {});
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {sections.map((s) => (
        <SectionRenderer key={s.id} section={s} onTrack={track} />
      ))}
      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-white/5">
        Powered by <span className="text-gradient font-semibold">TRENDSETTA SYSTEM™</span>
      </footer>
    </div>
  );
}
