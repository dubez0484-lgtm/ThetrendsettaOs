import {
  Globe,
  Workflow,
  Sparkles,
  CalendarRange,
  Package,
  Users,
  BarChart3,
  Wand2,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Website Builder",
    desc: "Drag-and-drop landing pages with forms, video, countdowns. Publish in one click.",
  },
  {
    icon: Workflow,
    title: "Funnel Builder",
    desc: "Opt-ins, checkout, upsells & split tests — with conversion analytics built in.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    desc: "Generate copy, hooks, emails and entire sales pages from a single prompt.",
  },
  {
    icon: CalendarRange,
    title: "Content Automation",
    desc: "Schedule, repurpose and auto-publish to TikTok, Instagram and YouTube.",
  },
  {
    icon: Package,
    title: "Digital Products",
    desc: "Sell courses, PDFs, templates and toolkits with automatic delivery.",
  },
  {
    icon: Users,
    title: "CRM & Leads",
    desc: "Manage contacts, track conversions and send broadcasts from one inbox.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Real-time revenue, traffic, CTR and audience growth with animated charts.",
  },
  {
    icon: Wand2,
    title: "AI Funnel Generator",
    desc: "Describe your offer. Get a complete funnel, page and email sequence in seconds.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <div className="text-sm text-primary font-medium mb-3">The platform</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="text-gradient">scale online.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            One operating system replaces a stack of subscriptions. Built for coaches, creators,
            consultants and modern digital businesses.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group glass rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="size-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 grid place-items-center border border-primary/20 group-hover:shadow-glow transition">
                <f.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-5 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
