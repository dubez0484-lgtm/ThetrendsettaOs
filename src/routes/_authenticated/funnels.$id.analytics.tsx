import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, MousePointerClick, UserPlus, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getFunnel, getFunnelAnalytics } from "@/lib/funnels.functions";

export const Route = createFileRoute("/_authenticated/funnels/$id/analytics")({
  head: () => ({ meta: [{ title: "Funnel Analytics — TRENDSETTA SYSTEM™" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { id } = Route.useParams();
  const get = useServerFn(getFunnel);
  const stats = useServerFn(getFunnelAnalytics);
  const { data: funnel } = useQuery({ queryKey: ["funnel", id], queryFn: () => get({ data: { id } }) });
  const { data, isLoading } = useQuery({ queryKey: ["funnel-analytics", id], queryFn: () => stats({ data: { id } }) });

  const cards = [
    { label: "Views", value: data?.totals.view ?? 0, icon: Eye, accent: "text-primary" },
    { label: "Opt-ins", value: data?.totals.optin ?? 0, icon: UserPlus, accent: "text-emerald-400" },
    { label: "Clicks", value: data?.totals.click ?? 0, icon: MousePointerClick, accent: "text-blue-400" },
    { label: "Conversion %", value: `${data?.conversionRate ?? 0}%`, icon: TrendingUp, accent: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-white/5 glass-strong">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center gap-3">
          <Link to="/funnels/$id" params={{ id }} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /></Link>
          <div className="text-sm font-semibold truncate">{funnel?.name ?? "Funnel"} · Analytics</div>
          <Link to="/funnels" className="ml-auto text-xs text-muted-foreground hover:text-foreground">All funnels</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <Icon className={`size-4 ${c.accent}`} />
                </div>
                <div className="text-2xl font-bold tabular-nums">{isLoading ? "…" : c.value}</div>
              </div>
            );
          })}
        </div>

        <div className="glass-strong rounded-2xl p-4 md:p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Last 14 days</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={data?.series ?? []}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "rgba(15,15,20,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#g1)" />
                <Area type="monotone" dataKey="optins" stroke="#34d399" fill="transparent" />
                <Area type="monotone" dataKey="clicks" stroke="#60a5fa" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {(!data || data.totals.view === 0) && !isLoading && (
          <div className="mt-6 text-sm text-muted-foreground text-center">
            No events yet. Publish your funnel and share the link to start collecting analytics.
          </div>
        )}
      </main>
    </div>
  );
}
