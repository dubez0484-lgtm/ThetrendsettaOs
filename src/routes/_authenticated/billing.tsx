import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Crown, Sparkles, Zap, CreditCard, Building2, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/billing")({
  component: BillingPage,
});

type Plan = {
  id: string;
  name: string;
  priceZAR: number;
  tagline: string;
  features: string[];
  highlight?: boolean;
  icon: typeof Sparkles;
  lemonSqueezyUrl: string;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceZAR: 97,
    tagline: "Launch your first AI funnel",
    icon: Sparkles,
    lemonSqueezyUrl: "https://your-ls-checkout-link.lemonsqueezy.com/buy/starter",
    features: [
      "1 active funnel",
      "AI Content Studio (limited)",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceZAR: 297,
    tagline: "Most popular for creators",
    icon: Crown,
    highlight: true,
    lemonSqueezyUrl: "https://your-ls-checkout-link.lemonsqueezy.com/buy/pro",
    features: [
      "Unlimited funnels",
      "Full AI Content Studio",
      "Lead Magnet + PDF Generator",
      "Automation Center",
      "Priority support",
    ],
  },
  {
    id: "empire",
    name: "Empire",
    priceZAR: 497,
    tagline: "For agencies & power users",
    icon: Zap,
    lemonSqueezyUrl: "https://your-ls-checkout-link.lemonsqueezy.com/buy/empire",
    features: [
      "Everything in Pro",
      "White-label exports",
      "Unlimited workspaces",
      "API access",
      "Dedicated success manager",
    ],
  },
];

const SA_BANKS = [
  "ABSA", "Standard Bank", "FNB", "Nedbank",
  "Capitec", "Investec", "African Bank", "TymeBank",
];

function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]);
  const [loading, setLoading] = useState<"ls" | "pf" | null>(null);

  const handleLemonSqueezy = () => {
    setLoading("ls");
    window.location.href = selectedPlan.lemonSqueezyUrl;
  };

  const handlePayFast = async () => {
    setLoading("pf");
    try {
      const res = await fetch("/api/payfast-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan.name,
          amount: selectedPlan.priceZAR,
        }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        toast.error("PayFast did not return a redirect URL");
        setLoading(null);
      }
    } catch (e) {
      toast.error("Could not start PayFast checkout. Try again.");
      setLoading(null);
    }
  };

  return (
    <DashboardLayout title="Billing & Plans">
      <div className="mx-auto max-w-6xl space-y-8 animate-[fade-up_0.5s_ease-out_both]">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Crown className="h-3 w-3" /> Billing & Plans
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Choose your <span className="text-gradient">unfair advantage</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Pay in ZAR with SA bank EFT via PayFast, or by card via Lemon Squeezy.
          </p>
        </header>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((plan) => {
            const active = selectedPlan.id === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`glass relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:-translate-y-0.5 ${
                  active
                    ? "border-primary/50 shadow-[0_0_30px_-8px_var(--primary)] ring-1 ring-primary/40"
                    : "hover:border-white/20"
                } ${plan.highlight ? "glass-strong" : ""}`}
              >
                {plan.highlight && (
                  <span className="absolute right-4 top-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Popular
                  </span>
                )}
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <plan.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">R{plan.priceZAR}</span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                {active && (
                  <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <span className="h-1.5 w-1.5 animate-[glow-pulse_2s_ease-in-out_infinite] rounded-full bg-primary" />
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Payment methods */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* PayFast */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">PayFast — Instant EFT</h3>
                <p className="text-xs text-muted-foreground">All major South African banks</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {SA_BANKS.map((b) => (
                <div
                  key={b}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center text-[10px] font-medium text-muted-foreground"
                >
                  {b}
                </div>
              ))}
            </div>

            <button
              onClick={handlePayFast}
              disabled={loading !== null}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-primary-foreground btn-glow transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading === "pf" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting…</>
              ) : (
                <>Pay R{selectedPlan.priceZAR} with PayFast</>
              )}
            </button>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Secure ZAR checkout · Instant EFT · Card · Capitec Pay
            </p>
          </div>

          {/* Lemon Squeezy */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-secondary to-primary">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Lemon Squeezy</h3>
                <p className="text-xs text-muted-foreground">International cards · Apple/Google Pay</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Visa, Mastercard, Amex</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Apple Pay & Google Pay</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Auto-invoicing & VAT handling</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Cancel anytime</li>
            </ul>

            <button
              onClick={handleLemonSqueezy}
              disabled={loading !== null}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-60"
            >
              {loading === "ls" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting…</>
              ) : (
                <>Pay with Lemon Squeezy</>
              )}
            </button>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Redirects to lemonsqueezy.com secure checkout
            </p>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          Need an invoice or custom plan? <a href="mailto:billing@thetrendsetta.com" className="text-primary hover:underline">Contact billing</a>.
        </p>
      </div>
    </DashboardLayout>
  );
}
