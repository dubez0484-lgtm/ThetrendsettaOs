import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard, Workflow, Sparkles, FileText, FileDown, Zap,
  Store, BarChart3, Settings, CreditCard, Search, Bell, ChevronLeft, ChevronRight,
  Menu, X, LogOut, Crown,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Funnel Builder", icon: Workflow, to: "/funnels" },
  { label: "AI Content Studio", icon: Sparkles, to: "/ai-studio" },
  { label: "Lead Magnet Builder", icon: FileText, to: "/lead-magnet" },
  { label: "PDF Generator", icon: FileDown, to: "/pdf-generator" },
  { label: "Automation Center", icon: Zap, to: "/automation" },
  { label: "Marketplace", icon: Store, to: "/marketplace" },
  { label: "Analytics", icon: BarChart3, to: "/analytics" },
  { label: "Billing & Plans", icon: CreditCard, to: "/billing" },
  { label: "Settings", icon: Settings, to: "/settings" },
] as const;

export function DashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0] || "Creator";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen w-full text-foreground">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative flex min-h-screen w-full">
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <aside
          className={`glass top-0 flex h-screen flex-col border-r border-white/5 transition-all duration-300 ${
            mobileOpen ? "fixed left-0 z-50 w-[260px] translate-x-0" : "fixed left-0 z-50 w-[260px] -translate-x-full"
          } md:sticky md:z-auto md:translate-x-0 md:flex ${collapsed ? "md:w-[76px]" : "md:w-[240px]"}`}
        >
          <div className="flex h-16 items-center justify-between gap-2 px-4">
            <Link to="/" className="flex items-center gap-2 overflow-hidden">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-[0_0_24px_-4px_var(--primary)]">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="min-w-0 leading-tight">
                  <span className="block truncate font-display text-sm font-semibold tracking-tight">THETRENDSETTA™</span>
                  <span className="block truncate text-[9px] font-medium uppercase tracking-[0.18em] text-primary/80">Unfair Advantage</span>
                </div>
              )}
            </Link>
            <button
              onClick={() => (mobileOpen ? setMobileOpen(false) : setCollapsed((c) => !c))}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              aria-label="Toggle sidebar"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {NAV.map((item) => {
              const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    active ? "bg-white/5 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                  )}
                  <item.icon className="h-4 w-4 shrink-0" />
                  {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {(!collapsed || mobileOpen) && (
            <div className="m-3 rounded-xl border border-white/10 bg-gradient-to-br from-primary/15 to-secondary/15 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Crown className="h-3.5 w-3.5 text-primary" />
                THETRENDSETTA™ Pro
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-primary/80">AI is your unfair advantage</p>
              <p className="mt-2 text-xs text-muted-foreground">7 days left in trial</p>
              <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-xs font-semibold text-primary-foreground btn-glow">
                Upgrade
              </button>
            </div>
          )}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-white/5 px-4 md:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground md:flex">
              <span className="grid h-5 w-5 place-items-center rounded bg-gradient-to-br from-primary to-secondary text-[10px] font-bold text-primary-foreground">{initial}</span>
              {displayName}'s Workspace
              <ChevronRight className="h-3 w-3 rotate-90" />
            </button>

            <div className="relative ml-0 flex-1 md:ml-4 md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search funnels, leads, content…"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button className="hidden rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-semibold text-primary-foreground btn-glow sm:inline-flex">
                Upgrade
              </button>
              <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
              </button>
              <button
                onClick={signOut}
                title="Sign out"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-secondary to-primary text-xs font-bold text-primary-foreground">
                {initial}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-10 pt-6 md:px-8">
            {title && <h1 className="sr-only">{title}</h1>}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
