import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import {
  User, CreditCard, Palette, Plug, Bell, KeyRound, Check, Copy,
  Instagram, Youtube, Twitter, Facebook, Music2, Mail,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — TRENDSETTA SYSTEM™" }] }),
  component: SettingsPage,
});

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: KeyRound },
] as const;

function SettingsPage() {
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("profile");
  const { user } = useAuth();

  return (
    <DashboardLayout title="Settings">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Settings</p>
          <h2 className="font-display text-2xl font-bold md:text-3xl">Workspace Configuration</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                  tab === t.id ? "glass-strong text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="space-y-4">
            {tab === "profile" && <ProfileTab email={user?.email ?? ""} />}
            {tab === "billing" && <BillingTab />}
            {tab === "branding" && <BrandingTab />}
            {tab === "integrations" && <IntegrationsTab />}
            {tab === "notifications" && <NotificationsTab />}
            {tab === "api" && <ApiKeysTab />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-2xl p-5 md:p-6">
      <div className="mb-5">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20";

function ProfileTab({ email }: { email: string }) {
  return (
    <Section title="Your Profile" desc="Public info shown across your workspace.">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground">
          {email.charAt(0).toUpperCase() || "T"}
        </div>
        <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground">
          Change avatar
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full Name"><input defaultValue="Zakhele" className={inputCls} /></Field>
        <Field label="Handle"><input defaultValue="@zakhele076" className={inputCls} /></Field>
        <Field label="Email"><input defaultValue={email} className={inputCls} /></Field>
        <Field label="Timezone">
          <select className={inputCls}>
            <option>Africa/Johannesburg</option>
            <option>UTC</option>
            <option>America/New_York</option>
          </select>
        </Field>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">Cancel</button>
        <button className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-primary-foreground btn-glow">Save changes</button>
      </div>
    </Section>
  );
}

function BillingTab() {
  const plans = [
    { name: "Starter", price: "R 0", current: false },
    { name: "Pro", price: "R 499/mo", current: true },
    { name: "Empire", price: "R 1,499/mo", current: false },
  ];
  return (
    <>
      <Section title="Current Plan" desc="Trial ends in 7 days.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-4 transition ${p.current ? "border-primary/40 bg-primary/5" : "border-white/10 bg-white/[0.02]"}`}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{p.name}</p>
                {p.current && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Active</span>}
              </div>
              <p className="mt-2 text-2xl font-bold">{p.price}</p>
              <button className={`mt-3 w-full rounded-lg py-2 text-xs font-semibold transition ${p.current ? "bg-white/5 text-muted-foreground" : "bg-gradient-to-r from-primary to-secondary text-primary-foreground btn-glow"}`}>
                {p.current ? "Manage" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Payment Method">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-14 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary text-xs font-bold text-primary-foreground">VISA</div>
            <div>
              <p className="text-sm font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/27</p>
            </div>
          </div>
          <button className="text-xs text-primary hover:underline">Update</button>
        </div>
      </Section>
    </>
  );
}

function BrandingTab() {
  const [color, setColor] = useState("#00D4FF");
  const palette = ["#00D4FF", "#7B61FF", "#22d3ee", "#a78bfa", "#f43f5e", "#10b981", "#f59e0b"];
  return (
    <>
      <Section title="Brand Identity" desc="Used across funnels, PDFs, and emails.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Brand Name"><input defaultValue="THETRENDSETTA™" className={inputCls} /></Field>
          <Field label="Tagline"><input defaultValue="The AI Creator OS" className={inputCls} /></Field>
        </div>
        <div className="mt-6">
          <Field label="Logo">
            <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] text-xs text-muted-foreground transition hover:border-primary/40">
              Drop logo or click to upload (PNG, SVG)
            </div>
          </Field>
        </div>
        <div className="mt-6">
          <Field label="Brand Color">
            <div className="flex flex-wrap gap-2">
              {palette.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="h-10 w-10 rounded-full border-2 transition"
                  style={{ background: c, borderColor: color === c ? "#fff" : "transparent", boxShadow: color === c ? `0 0 18px ${c}` : undefined }}
                  aria-label={c}
                />
              ))}
            </div>
          </Field>
        </div>
      </Section>
    </>
  );
}

function IntegrationsTab() {
  const apps = [
    { name: "Instagram", icon: Instagram, connected: true, handle: "@zakhele076" },
    { name: "TikTok", icon: Music2, connected: true, handle: "@thetrendsetta" },
    { name: "YouTube", icon: Youtube, connected: false },
    { name: "X / Twitter", icon: Twitter, connected: false },
    { name: "Facebook", icon: Facebook, connected: false },
    { name: "Email (Resend)", icon: Mail, connected: true, handle: "noreply@trendsetta.io" },
  ];
  return (
    <Section title="Connected Accounts" desc="Plug your stack into TRENDSETTA.">
      <ul className="space-y-2">
        {apps.map((a) => (
          <li key={a.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <a.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.connected ? a.handle : "Not connected"}</p>
              </div>
            </div>
            {a.connected ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-semibold uppercase text-primary">
                <Check className="h-3 w-3" /> Connected
              </span>
            ) : (
              <button className="rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Connect</button>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function NotificationsTab() {
  const items = [
    { label: "New lead captured", desc: "Email me whenever a funnel collects a new lead.", on: true },
    { label: "Sale completed", desc: "Instant push for new revenue.", on: true },
    { label: "Content published", desc: "When scheduled posts go live.", on: false },
    { label: "Weekly digest", desc: "Performance summary every Monday.", on: true },
    { label: "Product updates", desc: "New TRENDSETTA features & releases.", on: false },
  ];
  return (
    <Section title="Notifications">
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div>
              <p className="text-sm font-medium">{i.label}</p>
              <p className="text-xs text-muted-foreground">{i.desc}</p>
            </div>
            <Toggle defaultOn={i.on} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-to-r from-primary to-secondary shadow-[0_0_12px_var(--primary)]" : "bg-white/10"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function ApiKeysTab() {
  const [copied, setCopied] = useState(false);
  const key = "tss_live_••••••••••••••••3a7f";
  return (
    <Section title="API Keys" desc="Use these to integrate TRENDSETTA with external tools.">
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <code className="flex-1 truncate text-xs font-mono text-primary">{key}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(key); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">+ Generate new key</button>
      </div>
    </Section>
  );
}
