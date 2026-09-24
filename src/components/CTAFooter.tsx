import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CTAFooter() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden glass-strong rounded-3xl p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-transparent" />
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-secondary/30 blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
              Your digital empire starts <span className="text-gradient">today.</span>
            </h2>
            <p className="mt-5 text-muted-foreground text-lg max-w-xl mx-auto">
              Join creators building smarter, faster and bigger with TRENDSETTA.
            </p>
            <a
              href="#pricing"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-medium px-7 py-3.5 btn-glow hover:opacity-90 transition"
            >
              Start Building Free
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center">
              <Sparkles className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">
              TRENDSETTA<span className="text-primary">.</span>
            </span>
            <span className="ml-3 text-xs">© 2026 — The digital empire OS.</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link to="/terms" className="hover:text-foreground transition">Terms</Link>
            <Link to="/refund-policy" className="hover:text-foreground transition">Refund Policy</Link>
            <a href="mailto:support@thetrendsetta.com" className="hover:text-foreground transition">Contact</a>
          </div>
        </footer>
      </div>
    </section>
  );
}
