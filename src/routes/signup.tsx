import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { AuthShell } from "@/components/AuthShell";
import { Field, Divider, GoogleIcon } from "./login";

export const Route = createFileRoute("/signup")({ component: SignupPage });

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(100),
});

function SignupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/dashboard" }); }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Workspace created. Check your email to verify.");
    navigate({ to: "/login", search: { redirect: "/dashboard" } });
  };

  const onGoogle = async () => {
    setLoading(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (r.error) { toast.error(r.error.message); setLoading(false); }
  };

  return (
    <AuthShell
      title="Build Your Digital Empire"
      subtitle="Create your Trendsetta OS workspace and launch your online business."
      footer={<>Already a creator? <Link to="/login" search={{ redirect: "/dashboard" }} className="text-primary hover:underline">Sign in</Link></>}
    >
      <button onClick={onGoogle} disabled={loading}
        className="w-full glass rounded-xl py-2.5 px-4 text-sm font-medium hover:bg-white/10 transition flex items-center justify-center gap-2 mb-4">
        <GoogleIcon /> Continue with Google
      </button>

      <Divider />

      <form onSubmit={onSubmit} className="space-y-3">
        <Field icon={<User className="size-4" />}>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full name"
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" />
        </Field>
        <Field icon={<Mail className="size-4" />}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@brand.com"
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" />
        </Field>
        <Field icon={<Lock className="size-4" />}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password (min 6 chars)"
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" />
        </Field>

        <button type="submit" disabled={loading}
          className="w-full mt-2 rounded-xl bg-primary text-primary-foreground font-medium py-2.5 btn-glow hover:opacity-90 transition flex items-center justify-center gap-2">
          {loading && <Loader2 className="size-4 animate-spin" />} Create Workspace
        </button>
      </form>
    </AuthShell>
  );
}
