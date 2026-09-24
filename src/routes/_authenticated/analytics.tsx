import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  TrendingUp, TrendingDown, Users, DollarSign, Eye, MousePointerClick,
  Download, Globe, Calendar,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Line, LineChart, PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — TRENDSETTA SYSTEM™" }] }),
  component: AnalyticsPage,
});

const RANGES = ["7d", "30d", "90d", "12m"] as const;

const conversionTrend = Array.from({ length: 14 }, (_, i) => ({
  d: `D${i + 1}`,
  rate: 4 + Math.sin(i / 2) * 2 + Math.random() * 1.5,
  leads: 40 + i * 8 + Math.random() * 20,
}));

const revenueTrend = Array.from({ length: 12 }, (_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  v: 8000 + i * 1800 + Math.random() * 3000,
  ly: 6000 + i * 1100 + Math.random() * 2000,
}));

const trafficSources = [
  { name: "TikTok", v: 38, color: "oklch(0.82 0.17 220)" },
  { name: "Instagram", v: 26, color: "oklch(0.62 0.21 290)" },
  { name: "YouTube", v: 18, color: "oklch(0.85 0.18 200)" },
  { name: "Direct", v: 12, color: "oklch(0.72 0.16 160)" },
  { name: "Other", v: 6, color: "oklch(0.65 0.12 50)" },
];

const contentPerf = [
  { name: "Viral Hook Reel", views: 124000, ctr: 8.2 },
  { name: "AI Lead Magnet PDF", views: 88000, ctr: 12.4 },
  { name: "Tutorial — Funnel Build", views: 56000, ctr: 6.1 },
  { name: "Live Webinar Replay", views: 41000, ctr: 9.8 },
  { name: "Behind The Scenes", views: 32000, ctr: 4.5 },
];

function AnalyticsPage() {
  const [range, setRange] = useState<typeof RANGES[number]>("30d");

  return (
    <DashboardLayout title="Analytics">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Analytics</p>
          <h2 className="font-display text-2xl font-bold md:text-3xl">Growth Insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">Funnels, content, conversions — all in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  range === r ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground">
            <Calendar className="h-3.5 w-3.5" /> Custom
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Revenue" value="R 142,890" change="+24.3%" trend="up" icon={DollarSign} />
        <Kpi label="Conversion Rate" value="6.4%" change="+1.2pp" trend="up" icon={MousePointerClick} />
        <Kpi label="Leads" value="3,842" change="+18.1%" trend="up" icon={Users} />
        <Kpi label="Content Views" value="487K" change="-3.2%" trend="down" icon={Eye} />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Revenue Growth" subtitle="vs last year">
          <div className="h-[280px]">
            <ResponsiveContainer>
              <AreaChart data={revenueTrend} margin={{ left: -20, right: 4, top: 4 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.17 220)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.82 0.17 220)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.21 290)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.62 0.21 290)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="m" stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="ly" stroke="oklch(0.62 0.21 290)" strokeWidth={2} fill="url(#g2)" />
                <Area type="monotone" dataKey="v" stroke="oklch(0.82 0.17 220)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Traffic Sources" subtitle="Last 30 days">
          <div className="h-[200px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={trafficSources} dataKey="v" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {trafficSources.map((s) => <Cell key={s.name} fill={s.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {trafficSources.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-semibold">{s.v}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Funnel Conversion Trend" subtitle="14-day rolling">
          <div className="h-[260px]">
            <ResponsiveContainer>
              <LineChart data={conversionTrend} margin={{ left: -20, right: 4, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="d" stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rate" stroke="oklch(0.82 0.17 220)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Lead Generation" subtitle="Daily new leads">
          <div className="h-[260px]">
            <ResponsiveContainer>
              <BarChart data={conversionTrend} margin={{ left: -20, right: 4, top: 4 }}>
                <defs>
                  <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.17 220)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.21 290)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="d" stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="leads" fill="url(#bar2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="mt-4">
        <Card title="Top Performing Content" subtitle="By views & CTR">
          <ul className="space-y-2">
            {contentPerf.map((c, i) => (
              <li key={c.name} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-primary">
                  #{i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${(c.views / 124000) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{(c.views / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-primary">{c.ctr}% CTR</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </DashboardLayout>
  );
}

const tooltipStyle = {
  background: "oklch(0.16 0.04 270 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: 12,
  fontSize: 12,
};

function Kpi({ label, value, change, trend, icon: Icon }: { label: string; value: string; change: string; trend: "up" | "down"; icon: typeof Users }) {
  return (
    <div className="glass-strong rounded-2xl p-4 transition hover:border-primary/30 hover:shadow-[0_0_30px_-10px_var(--primary)] md:p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-xl font-bold tracking-tight md:text-2xl">{value}</p>
      <div className={`mt-1 flex items-center gap-1 text-xs ${trend === "up" ? "text-primary" : "text-destructive"}`}>
        {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {change} <span className="text-muted-foreground">vs prev</span>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-strong rounded-2xl p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <Globe className="h-4 w-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}
