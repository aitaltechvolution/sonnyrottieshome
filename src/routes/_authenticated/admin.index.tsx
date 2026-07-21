import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Dog, Inbox, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [pups, enq, newEnq] = await Promise.all([
        supabase.from("puppies").select("id,status", { count: "exact" }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      const available = (pups.data ?? []).filter((p) => p.status === "Available").length;
      return {
        total: pups.count ?? 0,
        available,
        enquiries: enq.count ?? 0,
        newEnquiries: newEnq.count ?? 0,
      };
    },
  });

  const cards = [
    { icon: Dog, label: "Total puppies", value: stats.data?.total ?? "—", to: "/admin/puppies" },
    { icon: Star, label: "Available", value: stats.data?.available ?? "—", to: "/admin/puppies" },
    { icon: Inbox, label: "Enquiries", value: stats.data?.enquiries ?? "—", to: "/admin/enquiries" },
    { icon: Inbox, label: "New enquiries", value: stats.data?.newEnquiries ?? "—", to: "/admin/enquiries" },
  ] as const;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Overview</p>
      <h1 className="mt-2 font-display text-4xl"><span className="text-gradient-gold">Dashboard</span></h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-2xl border border-border/60 bg-surface/60 p-6 transition hover:border-gold/40">
            <c.icon className="h-5 w-5 text-gold" />
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-display text-3xl">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
