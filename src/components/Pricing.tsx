import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    desc: "Launch your first funnel and test the platform.",
    features: ["1 website", "1 funnel", "AI assistant (limited)", "Basic analytics"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    suffix: "/mo",
    desc: "For creators selling digital products and services.",
    features: [
      "Unlimited funnels & sites",
      "Full AI Studio",
      "CRM & email broadcasts",
      "Digital product hosting",
      "Advanced analytics",
    ],
    cta: "Start Pro trial",
    highlight: true,
  },
  {
    name: "Business",
    price: "$79",
    suffix: "/mo",
    desc: "Automation, integrations and custom domains.",
    features: ["Everything in Pro", "Content automation", "Workflow automations", "Priority support"],
    cta: "Choose Business",
    highlight: false,
  },
  {
    name: "Agency",
    price: "$199",
    suffix: "/mo",
    desc: "Manage unlimited clients from one dashboard.",
    features: ["Unlimited workspaces", "Client management", "White-label", "API access"],
    cta: "Talk to sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm text-primary font-medium mb-3">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Plans that <span className="text-gradient">scale with you.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade as your empire grows.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "relative rounded-2xl p-6 flex flex-col " +
                (t.highlight
                  ? "glass-strong border-primary/40 shadow-glow"
                  : "glass")
              }
            >
              {t.highlight && (
                <div className="absolute -top-3 left-6 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold">
                  Most popular
                </div>
              )}
              <div className="font-semibold">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{t.price}</span>
                {t.suffix && <span className="text-muted-foreground text-sm">{t.suffix}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={
                  "mt-6 rounded-xl py-2.5 text-sm font-medium transition " +
                  (t.highlight
                    ? "bg-primary text-primary-foreground btn-glow hover:opacity-90"
                    : "glass-strong hover:bg-white/10")
                }
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
