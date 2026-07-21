import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { puppiesQueryOptions, resolveImage } from "@/lib/puppies-api";

export const Route = createFileRoute("/_authenticated/admin/puppies")({
  component: AdminPuppies,
});

function AdminPuppies() {
  const qc = useQueryClient();
  const { data: puppies = [], isLoading } = useQuery(puppiesQueryOptions());

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("puppies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Puppy deleted"); qc.invalidateQueries({ queryKey: ["puppies"] }); },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Catalog</p>
          <h1 className="mt-2 font-display text-4xl"><span className="text-gradient-gold">Puppies</span></h1>
        </div>
        <Link to="/admin/puppies/$id" params={{ id: "new" }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-luxe hover:brightness-110">
          <Plus className="h-4 w-4" /> New puppy
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-surface/40">
        {isLoading ? (
          <p className="p-8 text-sm text-muted-foreground">Loading…</p>
        ) : puppies.length === 0 ? (
          <p className="p-8 text-sm text-muted-foreground">No puppies yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/60 text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-4">Puppy</th>
                <th className="p-4">Status</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Age</th>
                <th className="p-4">Price</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {puppies.map((p) => (
                <tr key={p.id} className="border-b border-border/40 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={resolveImage(p)} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{p.name} {p.featured && <Star className="ml-1 inline h-3 w-3 text-gold" />}</p>
                        <p className="text-xs text-muted-foreground">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                      p.status === "Available" ? "bg-gold/20 text-gold" :
                      p.status === "Reserved" ? "bg-white/10" : "bg-black/30"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-4">{p.gender}</td>
                  <td className="p-4">{p.age_weeks}w</td>
                  <td className="p-4">{p.price ? `$${Number(p.price).toLocaleString()}` : "—"}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link to="/admin/puppies/$id" params={{ id: p.id }}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full gold-hairline px-3 text-xs hover:bg-surface/60">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <button onClick={() => { if (confirm(`Delete ${p.name}?`)) del.mutate(p.id); }}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
