import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — Sonny Rotties Home" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sonnyrottieshome@gmail.com");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — check email if confirmation is required.");
      }
    } catch (err) {
      const msg = (err as Error).message;
      const isInvalid = msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("credentials");
      toast.error(isInvalid
        ? "Invalid credentials — if you haven't created the account yet, click \"Need to create the admin account?\" below."
        : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="grid min-h-[80vh] place-items-center py-20">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-surface/60 p-8 md:p-10">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Admin Access</p>
          <h1 className="font-display text-4xl"><span className="text-gradient-gold">{mode === "signin" ? "Sign in" : "Create admin"}</span></h1>
          <p className="mt-2 text-sm text-muted-foreground">Restricted area — staff only.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-widest text-muted-foreground">Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-background/60 px-4 text-sm outline-none focus:border-gold" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-widest text-muted-foreground">Password</span>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-border/60 bg-background/60 px-4 text-sm outline-none focus:border-gold" />
            </label>
            <button disabled={loading} className="w-full rounded-full bg-gold px-7 py-4 text-sm font-medium text-primary-foreground shadow-luxe hover:brightness-110 disabled:opacity-60">
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold">
            {mode === "signin" ? "Need to create the admin account?" : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
    </SiteLayout>
  );
}
