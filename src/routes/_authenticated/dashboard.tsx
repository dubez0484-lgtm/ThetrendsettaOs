import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Workflow, Globe, Sparkles, Users, Package, Zap, Plus,
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight, PenTool,
  Wand2, Bot, Send, Rocket, Mail,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Line, LineChart,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TRENDSETTA SYSTEM™" },
      { name: "description", content: "Your creator business operating system." },
    ],
  }),
  component: DashboardPage,
});

const revenueData = [
  { d: "Mon", v: 2400, t: 1800 }, { d: "Tue", v: 1398, t: 2100 },
  { d: "Wed", v: 3800, t: 2400 }, { d: "Thu", v: 3908, t: 2700 },
  { d: "Fri", v: 4800, t: 3100 }, { d: "Sat", v: 6300, t: 3800 },
  { d: "Sun", v: 7200, t: 4200 },
];
const audienceData = [
  { d: "W1", v: 120 }, { d: "W2", v: 240 }, { d: "W3", v: 380 },
  { d: "W4", v: 520 }, { d: "W5", v: 720 }, { d: "W6", v: 980 }, { d: "W7", v: 1340 },
];
const trafficData = [
  { d: "Mon", v: 320 }, { d: "Tue", v: 410 }, { d: "Wed", v: 280 },
  { d: "Thu", v: 510 }, { d: "Fri", v: 620 }, { d: "Sat", v: 740 }, { d: "Sun", v: 590 },
];
const recentLeads = [
  { name: "Aria Mokoena", source: "TikTok Funnel", value: "R 1,290", time: "2m" },
  { name: "Liam Patel", source: "Landing Page A", value: "R 890", time: "14m" },
  { name: "Zinhle Dube", source: "Email Capture", value: "R 2,100", time: "37m" },
  { name: "Mason Cole", source: "Webinar Funnel", value: "R 4,500", time: "1h" },
  { name: "Nadia Khan", source: "Instagram Bio", value: "R 740", time: "2h" },
];
const recentCustomers = [
  { name: "Thandi Nkosi", plan: "Pro Coach Bundle", value: "R 4,997", status: "Paid" },
  { name: "James Reed", plan: "Funnel Templates Pack", value: "R 1,499", status: "Paid" },
  { name: "Priya Singh", plan: "AI Studio Annual", value: "R 9,888", status: "Paid" },
  { name: "Kabelo Maluleke", plan: "Starter Kit", value: "R 499", status: "Refund" },
];
const activity = [
  { icon: Workflow, text: "Funnel 'High-Ticket Coach' published", time: "Just now" },
  { icon: Users, text: "12 new leads from TikTok Bio Funnel", time: "8m ago" },
  { icon: DollarSign, text: "Sale completed — R 4,997 (Pro Bundle)", time: "22m ago" },
  { icon: Zap, text: "Automation 'Welcome Series' sent 84 emails", time: "1h ago" },
  { icon: Sparkles, text: "AI generated 6 new TikTok hooks", time: "3h ago" },
];

const tooltipStyle = {
  background: "oklch(0.16 0.04 270 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12, fontSize: 12,
};

function DashboardPage() {
  const [aiOpen, setAiOpen] = useState(false);
  const { user } = useAuth();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0] || "Creator";

  return (
    <DashboardLayout title="Dashboard">
      <section className="animate-[fade-up_0.6s_ease-out_both]">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3 w-3" /> THETRENDSETTA™ OS
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">
          Welcome back, <span className="text-gradient">{displayName}</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          <span className="font-semibold tracking-wide text-foreground/90">AI IS YOUR UNFAIR ADVANTAGE.</span> Run your empire from one command center.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 md:gap-4">
        <StatCard label="Revenue" value="R 28,940" change="+18.2%" trend="up" icon={DollarSign} delay="0.05s" />
        <StatCard label="Leads" value="1,284" change="+24.1%" trend="up" icon={Users} delay="0.1s" />
        <StatCard label="Funnel Conversion" value="6.4%" change="+1.2pp" trend="up" icon={Workflow} delay="0.15s" />
        <StatCard label="Content Pipeline" value="42" change="+8 scheduled" trend="up" icon={PenTool} delay="0.2s" />
        <StatCard label="Active Automations" value="17" change="+3 live" trend="up" icon={Zap} delay="0.25s" />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-strong animate-[fade-up_0.7s_ease-out_both] rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Revenue</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />This week</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary" />Last week</span>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer>
              <AreaChart data={revenueData} margin={{ left: -20, right: 4, top: 4 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.17 220)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.82 0.17 220)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.21 290)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.62 0.21 290)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="d" stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="t" stroke="oklch(0.62 0.21 290)" strokeWidth={2} fill="url(#rev2)" />
                <Area type="monotone" dataKey="v" stroke="oklch(0.82 0.17 220)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-strong animate-[fade-up_0.8s_ease-out_both] rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold">Audience Growth</h3>
            <p className="text-xs text-muted-foreground">+1,340 followers</p>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer>
              <LineChart data={audienceData} margin={{ left: -20, right: 4, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="d" stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="v" stroke="oklch(0.85 0.18 200)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <h3 className="mb-3 font-display text-sm font-semibold text-muted-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <QuickAction icon={Workflow} label="Create Funnel" />
          <QuickAction icon={Wand2} label="AI Content" />
          <QuickAction icon={Globe} label="Build Website" />
          <QuickAction icon={Package} label="Upload Product" />
          <QuickAction icon={Zap} label="Start Automation" />
        </div>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-strong rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-display text-base font-semibold">Recent Leads</h3><p className="text-xs text-muted-foreground">Last 24 hours</p></div>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline">View all <ArrowUpRight className="h-3 w-3" /></button>
          </div>
          <ul className="space-y-3">
            {recentLeads.map((l) => (
              <li key={l.name} className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 text-xs font-semibold">{l.name.charAt(0)}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{l.name}</p><p className="truncate text-xs text-muted-foreground">{l.source}</p></div>
                <div className="text-right"><p className="text-sm font-semibold">{l.value}</p><p className="text-xs text-muted-foreground">{l.time}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-display text-base font-semibold">Recent Customers</h3><p className="text-xs text-muted-foreground">Latest sales</p></div>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline">View all <ArrowUpRight className="h-3 w-3" /></button>
          </div>
          <ul className="space-y-3">
            {recentCustomers.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-secondary/30 to-accent/30 text-xs font-semibold">{c.name.charAt(0)}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{c.name}</p><p className="truncate text-xs text-muted-foreground">{c.plan}</p></div>
                <div className="text-right"><p className="text-sm font-semibold">{c.value}</p><span className={`text-[10px] font-medium ${c.status === "Paid" ? "text-primary" : "text-destructive"}`}>{c.status}</span></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <div className="mb-4"><h3 className="font-display text-base font-semibold">Traffic</h3><p className="text-xs text-muted-foreground">Sessions this week</p></div>
          <div className="h-[180px]">
            <ResponsiveContainer>
              <BarChart data={trafficData} margin={{ left: -20, right: 4, top: 4 }}>
                <defs>
                  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.17 220)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.21 290)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="d" stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="v" fill="url(#bar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="glass-strong rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-display text-base font-semibold">Recent Activity</h3><p className="text-xs text-muted-foreground">Live across your workspace</p></div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 animate-[glow-pulse_2s_ease-in-out_infinite] rounded-full bg-primary" />Live</span>
          </div>
          <ul className="space-y-3">
            {activity.map((a, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20"><a.icon className="h-4 w-4 text-primary" /></div>
                <p className="flex-1 text-sm">{a.text}</p>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Floating AI Assistant */}
      <button
        onClick={() => setAiOpen(true)}
        className={`fixed bottom-6 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-[0_0_30px_-4px_var(--primary)] transition hover:scale-105 md:right-6 ${aiOpen ? "scale-0 opacity-0" : ""}`}
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
        <span className="absolute inset-0 animate-[glow-pulse_3s_ease-in-out_infinite] rounded-full ring-2 ring-primary/40" />
      </button>

      {aiOpen && (
        <div className="fixed inset-x-3 bottom-6 z-50 max-h-[70vh] animate-[fade-up_0.3s_ease-out_both] overflow-hidden rounded-2xl md:inset-x-auto md:right-6 md:w-[380px]">
          <div className="glass-strong flex h-full flex-col rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 border-b border-white/5 p-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
              <div className="flex-1"><p className="text-sm font-semibold">AI Assistant</p><p className="text-xs text-muted-foreground">Powered by Trendsetta AI</p></div>
              <button onClick={() => setAiOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground" aria-label="Close">✕</button>
            </div>
            <div className="space-y-2 p-4">
              {[
                { icon: Rocket, label: "Generate viral hooks" },
                { icon: PenTool, label: "Write captions" },
                { icon: Mail, label: "Create email sequence" },
                { icon: Globe, label: "Build sales page" },
              ].map((i) => (
                <button key={i.label} className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left text-sm transition hover:border-primary/30 hover:bg-white/[0.05]">
                  <i.icon className="h-4 w-4 text-primary" />{i.label}
                </button>
              ))}
            </div>
            <div className="mt-auto border-t border-white/5 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
                <input placeholder="Create a viral TikTok hook for my offer" className="flex-1 bg-transparent px-2 text-sm placeholder:text-muted-foreground focus:outline-none" />
                <button className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground"><Send className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ label, value, change, trend, icon: Icon, delay }: { label: string; value: string; change: string; trend: "up" | "down"; icon: typeof DollarSign; delay: string }) {
  return (
    <div className="glass-strong rounded-2xl p-4 transition hover:border-primary/30 hover:shadow-[0_0_30px_-10px_var(--primary)]" style={{ animation: `fade-up 0.7s ease-out ${delay} both` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20"><Icon className="h-3.5 w-3.5 text-primary" /></div>
      </div>
      <p className="mt-2 text-lg font-bold tracking-tight md:text-xl">{value}</p>
      <div className={`mt-1 flex items-center gap-1 text-[10px] ${trend === "up" ? "text-primary" : "text-destructive"}`}>
        {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {change}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label }: { icon: typeof Workflow; label: string }) {
  return (
    <button className="glass group flex items-center gap-3 rounded-2xl p-4 text-left transition hover:border-primary/40 hover:bg-white/[0.06]">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground transition group-hover:scale-110"><Icon className="h-4 w-4" /></div>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{label}</p><p className="text-xs text-muted-foreground">Get started</p></div>
      <Plus className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
    </button>
  );
}
