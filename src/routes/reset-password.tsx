import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/AuthShell";
import { Field } from "./login";

export const Route = createFileRoute("/reset-password")({ component: ResetPage });

function ResetPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"request" | "update">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setMode("update");
    }
  }, []);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) { toast.error("Enter a valid email"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Check your inbox for the reset link.");
  };

  const updatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Min 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      title={mode === "request" ? "Reset Password" : "Set New Password"}
      subtitle={mode === "request" ? "We'll email you a secure reset link." : "Choose a new password to continue."}
      footer={<Link to="/login" search={{ redirect: "/dashboard" }} className="text-primary hover:underline">Back to sign in</Link>}
    >
      {mode === "request" ? (
        <form onSubmit={sendLink} className="space-y-3">
          <Field icon={<Mail className="size-4" />}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@brand.com"
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" />
          </Field>
          <button type="submit" disabled={loading}
            className="w-full mt-2 rounded-xl bg-primary text-primary-foreground font-medium py-2.5 btn-glow hover:opacity-90 transition flex items-center justify-center gap-2">
            {loading && <Loader2 className="size-4 animate-spin" />} Send Reset Link
          </button>
        </form>
      ) : (
        <form onSubmit={updatePass} className="space-y-3">
          <Field icon={<Lock className="size-4" />}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="New password"
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" />
          </Field>
          <button type="submit" disabled={loading}
            className="w-full mt-2 rounded-xl bg-primary text-primary-foreground font-medium py-2.5 btn-glow hover:opacity-90 transition flex items-center justify-center gap-2">
            {loading && <Loader2 className="size-4 animate-spin" />} Update Password
          </button>
        </form>
      )}
    </AuthShell>
  );
}
