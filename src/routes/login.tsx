import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { AuthShell } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/dashboard",
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(100),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate({ to: redirect }); }, [user, navigate, redirect]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back");
    navigate({ to: redirect });
  };

  const onGoogle = async () => {
    setLoading(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + redirect });
    if (r.error) { toast.error(r.error.message); setLoading(false); }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Access your digital business operating system."
      footer={<>New here? <Link to="/signup" className="text-primary hover:underline">Create a workspace</Link></>}
    >
      <button
        onClick={onGoogle}
        disabled={loading}
        className="w-full glass rounded-xl py-2.5 px-4 text-sm font-medium hover:bg-white/10 transition flex items-center justify-center gap-2 mb-4"
      >
        <GoogleIcon /> Continue with Google
      </button>

      <Divider />

      <form onSubmit={onSubmit} className="space-y-3">
        <Field icon={<Mail className="size-4" />}>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@brand.com"
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
          />
        </Field>
        <Field icon={<Lock className="size-4" />}>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
          />
        </Field>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
              className="accent-primary size-3.5" />
            Remember me
          </label>
          <Link to="/reset-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full mt-2 rounded-xl bg-primary text-primary-foreground font-medium py-2.5 btn-glow hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="size-4 animate-spin" />} Sign In
        </button>
      </form>
    </AuthShell>
  );
}

export function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:glow-border transition">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 my-4 text-[11px] uppercase tracking-widest text-muted-foreground/60">
      <div className="h-px bg-white/10 flex-1" /> or <div className="h-px bg-white/10 flex-1" />
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.97 6.97 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
