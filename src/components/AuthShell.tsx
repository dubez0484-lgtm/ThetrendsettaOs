import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen relative grid-bg flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* glow particles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-10 size-72 rounded-full bg-primary/20 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-10 right-10 size-96 rounded-full bg-secondary/20 blur-3xl animate-glow-pulse" />
        <div className="absolute top-1/2 left-1/2 size-64 rounded-full bg-accent/10 blur-3xl animate-float" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center btn-glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            TRENDSETTA<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="glass-strong rounded-3xl p-7 md:p-8 shadow-glow">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">{title}</h1>
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          </div>
          {children}
        </div>

        {footer && <div className="text-center text-sm text-muted-foreground mt-6">{footer}</div>}
      </div>
    </div>
  );
}
