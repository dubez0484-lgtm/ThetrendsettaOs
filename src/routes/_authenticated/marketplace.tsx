import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Store, Star, Eye, Download, Workflow, FileText, Palette, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — TRENDSETTA SYSTEM™" }] }),
  component: MarketplacePage,
});

const CATS = ["All", "Funnel Templates", "PDF Kits", "Canva Templates", "Swipe Files"] as const;

const ITEMS = [
  { name: "High-Ticket Coach Funnel", cat: "Funnel Templates", price: "R 899", rating: 4.9, sales: 1240, icon: Workflow },
  { name: "30-Day Lead Magnet Kit", cat: "PDF Kits", price: "R 499", rating: 4.8, sales: 860, icon: FileText },
  { name: "Reels Cover Pack — Neon", cat: "Canva Templates", price: "R 299", rating: 5.0, sales: 2110, icon: Palette },
  { name: "Viral Hook Swipe Vault", cat: "Swipe Files", price: "R 199", rating: 4.7, sales: 3490, icon: Sparkles },
  { name: "Webinar Replay Funnel", cat: "Funnel Templates", price: "R 1,299", rating: 4.9, sales: 540, icon: Workflow },
  { name: "Coach Onboarding PDF", cat: "PDF Kits", price: "R 399", rating: 4.8, sales: 690, icon: FileText },
  { name: "Story Templates Vol. 2", cat: "Canva Templates", price: "R 249", rating: 4.9, sales: 1820, icon: Palette },
  { name: "Email Subject Line Vault", cat: "Swipe Files", price: "R 149", rating: 4.6, sales: 4200, icon: Sparkles },
];

function MarketplacePage() {
  return (
    <DashboardLayout title="Marketplace">
      <section className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-[0_0_24px_-4px_var(--primary)]">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Marketplace</p>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Plug-and-play Assets</h2>
            </div>
          </div>
          <button className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground btn-glow">
            Sell your own
          </button>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {CATS.map((c, i) => (
          <button
            key={c}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              i === 0 ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground" : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <article key={item.name} className="glass-strong group flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_var(--primary)]">
            <div className="relative grid h-32 place-items-center overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/15 to-transparent">
              <item.icon className="h-10 w-10 text-primary/80 transition group-hover:scale-110" />
              <span className="absolute right-2 top-2 rounded-full bg-background/60 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">{item.cat}</span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="text-sm font-semibold">{item.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{item.rating}</span>
                <span>·</span>
                <span>{item.sales.toLocaleString()} sales</span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-gradient">{item.price}</span>
                <div className="flex gap-1">
                  <button className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground" aria-label="Preview"><Eye className="h-3.5 w-3.5" /></button>
                  <button className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground" aria-label="Buy"><Download className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}
