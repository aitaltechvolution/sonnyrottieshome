import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { PuppyRow, PuppyStatus } from "@/lib/puppies-api";

export const Route = createFileRoute("/_authenticated/admin/puppies/$id")({
  component: PuppyEditor,
});

type Form = Omit<PuppyRow, "id"> & { id?: string };

const empty: Form = {
  slug: "", name: "", gender: "Male", age_weeks: 8, dob: null,
  color: "", weight: "", price: null, status: "Available", featured: false,
  image_url: "", gallery: [], description: "", temperament: "",
  vaccination: "", deworming: "", father: "", mother: "",
};

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function PuppyEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    supabase.from("puppies").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
      if (error) toast.error(error.message);
      else if (data) setForm(data as PuppyRow);
      setLoading(false);
    });
  }, [id, isNew]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const uploadImage = async (file: File, into: "image_url" | "gallery") => {
    setUploading(true);
    try {
      const path = `${form.slug || "puppy"}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error } = await supabase.storage.from("puppies").upload(path, file);
      if (error) throw error;
      const { data } = await supabase.storage.from("puppies").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      if (!data?.signedUrl) throw new Error("No URL returned");
      if (into === "image_url") set("image_url", data.signedUrl);
      else set("gallery", [...(form.gallery ?? []), data.signedUrl]);
      toast.success("Uploaded");
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        price: form.price === null || (form.price as unknown as string) === "" ? null : Number(form.price),
        age_weeks: Number(form.age_weeks),
        dob: form.dob || null,
      };
      if (isNew) {
        const { id: _omit, ...insertPayload } = payload;
        void _omit;
        const { error } = await supabase.from("puppies").insert(insertPayload);
        if (error) throw error;
        toast.success("Puppy created");
      } else {
        const { error } = await supabase.from("puppies").update(payload).eq("id", id);
        if (error) throw error;
        toast.success("Saved");
      }
      navigate({ to: "/admin/puppies" });
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <form onSubmit={save} className="max-w-4xl">
      <button type="button" onClick={() => navigate({ to: "/admin/puppies" })}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-display text-4xl"><span className="text-gradient-gold">{isNew ? "New puppy" : `Edit ${form.name}`}</span></h1>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Field label="Name"><input required value={form.name} onChange={(e) => { set("name", e.target.value); if (isNew) set("slug", slugify(e.target.value)); }} className={inp} /></Field>
        <Field label="Slug"><input required value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={inp} /></Field>
        <Field label="Gender">
          <select value={form.gender} onChange={(e) => set("gender", e.target.value as "Male" | "Female")} className={inp}>
            <option>Male</option><option>Female</option>
          </select>
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => set("status", e.target.value as PuppyStatus)} className={inp}>
            <option>Available</option><option>Reserved</option><option>Sold</option>
          </select>
        </Field>
        <Field label="Age (weeks)"><input type="number" min={1} value={form.age_weeks} onChange={(e) => set("age_weeks", Number(e.target.value))} className={inp} /></Field>
        <Field label="Date of birth"><input type="date" value={form.dob ?? ""} onChange={(e) => set("dob", e.target.value)} className={inp} /></Field>
        <Field label="Color"><input value={form.color ?? ""} onChange={(e) => set("color", e.target.value)} className={inp} /></Field>
        <Field label="Weight"><input value={form.weight ?? ""} onChange={(e) => set("weight", e.target.value)} className={inp} /></Field>
        <Field label="Price (USD)"><input type="number" min={0} value={form.price ?? ""} onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))} className={inp} /></Field>
        <Field label="Father"><input value={form.father ?? ""} onChange={(e) => set("father", e.target.value)} className={inp} /></Field>
        <Field label="Mother"><input value={form.mother ?? ""} onChange={(e) => set("mother", e.target.value)} className={inp} /></Field>
        <Field label="Temperament"><input value={form.temperament ?? ""} onChange={(e) => set("temperament", e.target.value)} className={inp} /></Field>
        <Field label="Vaccination"><input value={form.vaccination ?? ""} onChange={(e) => set("vaccination", e.target.value)} className={inp} /></Field>
        <Field label="Deworming"><input value={form.deworming ?? ""} onChange={(e) => set("deworming", e.target.value)} className={inp} /></Field>
        <Field label="Description" className="md:col-span-2">
          <textarea rows={4} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} className={`${inp} resize-none py-3`} />
        </Field>
        <label className="md:col-span-2 flex items-center gap-3 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4" />
          Featured on homepage
        </label>
      </div>

      <div className="mt-10 space-y-6">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">Main image</p>
          <div className="flex items-center gap-4">
            {form.image_url && <img src={form.image_url} alt="" className="h-20 w-20 rounded-xl object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full gold-hairline px-4 py-2 text-sm hover:bg-surface/60">
              <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "image_url")} />
            </label>
            {form.image_url && <button type="button" onClick={() => set("image_url", "")} className="text-xs text-destructive">Remove</button>}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">Gallery</p>
          <div className="flex flex-wrap items-center gap-3">
            {(form.gallery ?? []).map((g, i) => (
              <div key={i} className="relative">
                <img src={g} alt="" className="h-20 w-20 rounded-xl object-cover" />
                <button type="button" onClick={() => set("gallery", form.gallery.filter((_, x) => x !== i))}
                  className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-white"><X className="h-3 w-3" /></button>
              </div>
            ))}
            <label className="inline-flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border/60 text-muted-foreground hover:border-gold">
              <Upload className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "gallery")} />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <button disabled={saving} className="rounded-full bg-gold px-7 py-4 text-sm font-medium text-primary-foreground shadow-luxe hover:brightness-110 disabled:opacity-60">
          {saving ? "Saving…" : "Save puppy"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/puppies" })} className="rounded-full gold-hairline px-7 py-4 text-sm hover:bg-surface/60">Cancel</button>
      </div>
    </form>
  );
}

const inp = "h-11 w-full rounded-xl border border-border/60 bg-background/60 px-4 text-sm outline-none focus:border-gold";
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
