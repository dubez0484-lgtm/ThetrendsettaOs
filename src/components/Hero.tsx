import heroImg from "@/assets/hero-dashboard.jpg";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-36 md:pt-44 pb-20 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8 animate-[fade-up_0.6s_ease-out_both]">
          <span className="size-1.5 rounded-full bg-primary animate-[glow-pulse_3s_ease-in-out_infinite]" />
          Introducing TRENDSETTA SYSTEM™ — your AI business OS
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl mx-auto leading-[1.05] animate-[fade-up_0.8s_ease-out_both]">
          Build Your Digital{" "}
          <span className="text-gradient">Empire</span>
          <br className="hidden md:block" /> From One Platform
        </h1>

        <p className="mt-6 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto animate-[fade-up_1s_ease-out_both]">
          Launch funnels, websites, AI systems, content automation and digital products —
          all in one minimalist workspace built for creators.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-[fade-up_1.2s_ease-out_both]">
          <a
            href="#pricing"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-medium px-6 py-3.5 btn-glow hover:opacity-90 transition w-full sm:w-auto justify-center"
          >
            Start Building
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition" />
          </a>
          <a
            href="#dashboard"
            className="inline-flex items-center gap-2 rounded-xl glass-strong text-foreground font-medium px-6 py-3.5 hover:bg-white/10 transition w-full sm:w-auto justify-center"
          >
            <PlayCircle className="size-4" />
            Watch Demo
          </a>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          No credit card required · Free starter plan · Cancel anytime
        </div>

        {/* Hero image */}
        <div className="relative mt-16 md:mt-20 animate-[fade-up_1.4s_ease-out_both]">
          <div className="absolute -inset-x-10 -inset-y-10 bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent blur-3xl opacity-60" />
          <div className="relative glass-strong rounded-3xl p-2 md:p-3 shadow-glow">
            <img
              src={heroImg}
              alt="TRENDSETTA SYSTEM dashboard preview showing funnel analytics, AI assistant and sales graphs"
              className="w-full rounded-2xl"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
