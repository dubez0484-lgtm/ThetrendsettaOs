import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-background/60">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center">
            <Sparkles className="size-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-foreground tracking-tight">
            THETRENDSETTA OS<span className="text-primary">.</span>
          </span>
          <span className="ml-3 text-xs">© 2026 — AI is your unfair advantage.</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs">
          <a
            href="https://instagram.com/zakhele.thetrendsetta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-primary transition"
          >
            <Instagram className="size-3.5" /> Instagram
          </a>
          <a
            href="mailto:hello@thetrendsetta.com"
            className="inline-flex items-center gap-1.5 hover:text-primary transition"
          >
            <Mail className="size-3.5" /> Contact
          </a>
          <Link to="/privacy" className="hover:text-primary transition">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-primary transition">
            Terms
          </Link>
          <Link to="/refund-policy" className="hover:text-primary transition">
            Refund Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
