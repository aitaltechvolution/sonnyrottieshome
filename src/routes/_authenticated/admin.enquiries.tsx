import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  component: EnquiriesPage,
});

type Enquiry = {
  id: string; name: string; email: string; phone: string;
  puppy_name: string | null; message: string;
  status: "new" | "contacted" | "closed"; created_at: string;
};

function EnquiriesPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Enquiry[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Enquiry["status"] }) => {
      const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["enquiries"] }); },
  });

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Inbox</p>
      <h1 className="mt-2 font-display text-4xl"><span className="text-gradient-gold">Enquiries</span></h1>

      <div className="mt-10 space-y-4">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
          rows.length === 0 ? <p className="text-sm text-muted-foreground">No enquiries yet.</p> :
          rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border/60 bg-surface/60 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl">{r.name}</h3>
                    {r.puppy_name && <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">Re: {r.puppy_name}</span>}
                    <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                      r.status === "new" ? "bg-gold/20 text-gold" : r.status === "contacted" ? "bg-white/10" : "bg-black/30"
                    }`}>{r.status}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:text-gold"><Mail className="h-3.5 w-3.5" /> {r.email}</a>
                    <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 hover:text-gold"><Phone className="h-3.5 w-3.5" /> {r.phone}</a>
                    <span>{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select value={r.status} onChange={(e) => setStatus.mutate({ id: r.id, status: e.target.value as Enquiry["status"] })}
                    className="h-9 rounded-full border border-border/60 bg-background/60 px-3 text-xs">
                    <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                  </select>
                  <button onClick={() => { if (confirm("Delete this enquiry?")) del.mutate(r.id); }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{r.message}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
