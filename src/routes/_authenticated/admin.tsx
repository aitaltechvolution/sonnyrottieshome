import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Dog, Inbox, LayoutDashboard, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Sonny Rotties Home" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type NavItem = { to: "/admin" | "/admin/puppies" | "/admin/enquiries" | "/admin/settings"; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/puppies", label: "Puppies", icon: Dog },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const ADMIN_EMAIL = "sonnyrottieshome@gmail.com";

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email ?? null;
      setEmail(userEmail);
      setIsAdmin(userEmail === ADMIN_EMAIL);
      setChecking(false);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

  if (checking) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="max-w-md rounded-3xl border border-border/60 bg-surface/60 p-10 text-center">
          <h1 className="font-display text-3xl"><span className="text-gradient-gold">Access denied</span></h1>
          <p className="mt-3 text-sm text-muted-foreground">Your account ({email}) is not an admin. Ask the site owner to grant admin access.</p>
          <button onClick={signOut} className="mt-6 rounded-full gold-hairline px-6 py-3 text-sm">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid md:grid-cols-[260px_1fr]">
        <aside className="border-r border-border/60 bg-surface/40 p-6 md:min-h-screen">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Sonny Rotties Home" className="h-9 w-auto object-contain" />
          </Link>
          <nav className="mt-10 space-y-1">
            {NAV.map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    active ? "bg-gold/15 text-gold" : "text-foreground/80 hover:bg-surface/60 hover:text-gold"
                  }`}>
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-10 rounded-2xl border border-border/60 p-4 text-xs text-muted-foreground">
            <p className="truncate">{email}</p>
            <button onClick={signOut} className="mt-3 inline-flex items-center gap-2 text-gold hover:brightness-110">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </aside>
        <main className="p-6 md:p-10"><Outlet /></main>
      </div>
    </div>
  );
}