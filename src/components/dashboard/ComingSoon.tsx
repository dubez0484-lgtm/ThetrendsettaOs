import { type ReactNode } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export function ComingSoon({
  eyebrow,
  title,
  description,
  features,
  icon: Icon = Sparkles,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: { title: string; desc: string; icon: typeof Sparkles }[];
  icon?: typeof Sparkles;
}) {
  return (
    <div className="mx-auto max-w-5xl animate-[fade-up_0.6s_ease-out_both]">
      <section className="glass-strong relative overflow-hidden rounded-3xl p-8 md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 animate-[glow-pulse_2s_ease-in-out_infinite] rounded-full bg-primary" />
            {eyebrow}
          </div>
          <div className="mt-6 flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-[0_0_30px_-6px_var(--primary)]">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
                <span className="text-gradient">{title}</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass group rounded-2xl p-4 transition hover:border-primary/30 hover:bg-white/[0.06]"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-3 text-sm font-semibold">{f.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-primary-foreground btn-glow transition hover:scale-[1.02]">
            Notify me when ready
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

export function PageWrap({ children }: { children: ReactNode }) {
  return <div className="animate-[fade-up_0.5s_ease-out_both]">{children}</div>;
}
