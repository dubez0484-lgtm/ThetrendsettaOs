import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SiteNav() {
  const { user } = useAuth();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-4">
        <nav className="glass rounded-2xl flex items-center justify-between px-4 md:px-6 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center btn-glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold tracking-tight text-base">
              TRENDSETTA<span className="text-primary">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#dashboard" className="hover:text-foreground transition">Platform</a>
            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium px-4 py-2 btn-glow hover:opacity-90 transition">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" search={{ redirect: "/dashboard" }} className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition px-3 py-1.5">
                  Sign in
                </Link>
                <Link to="/signup"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium px-4 py-2 btn-glow hover:opacity-90 transition">
                  Start Building
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
