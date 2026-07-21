import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { PuppyCard } from "@/components/puppy-card";
import { PuppyModal } from "@/components/puppy-modal";
import { puppiesQueryOptions, type PuppyRow } from "@/lib/puppies-api";

export const Route = createFileRoute("/puppies")({
  head: () => ({
    meta: [
      { title: "Available Puppies — Sonny Rotties Home" },
      { name: "description", content: "Browse our current litter of premium Rottweiler puppies. Filter by gender, age, color and availability." },
      { property: "og:title", content: "Available Rottweiler Puppies — Sonny Rotties Home" },
    ],
  }),
  component: PuppiesPage,
});

function PuppiesPage() {
  const { data: puppies = [], isLoading } = useQuery(puppiesQueryOptions());
  const [q, setQ] = useState("");
  const [gender, setGender] = useState<"All" | "Male" | "Female">("All");
  const [status, setStatus] = useState<"All" | "Available" | "Reserved" | "Sold">("All");
  const [sort, setSort] = useState<"newest" | "oldest" | "price">("newest");
  const [selected, setSelected] = useState<PuppyRow | null>(null);

  const list = useMemo(() => {
    let l = [...puppies];
    if (q) l = l.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (gender !== "All") l = l.filter((p) => p.gender === gender);
    if (status !== "All") l = l.filter((p) => p.status === status);
    if (sort === "newest") l.sort((a, b) => a.age_weeks - b.age_weeks);
    if (sort === "oldest") l.sort((a, b) => b.age_weeks - a.age_weeks);
    if (sort === "price") l.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    return l;
  }, [puppies, q, gender, status, sort]);

  return (
    <SiteLayout>
      <section className="py-16 md:py-24">
        <div className="container-luxe">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Available Now</p>
          <h1 className="max-w-3xl text-5xl leading-[1.02] tracking-tight md:text-6xl">Our puppies.</h1>
          <p className="mt-6 max-w-xl text-muted-foreground">Each puppy is family-raised, vet-checked, and ready to become part of your world.</p>

          <div className="mt-12 flex flex-wrap items-center gap-3 border-y border-border py-4">
            <label className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name" className="h-10 w-full border-0 bg-transparent pl-6 pr-4 text-sm outline-none placeholder:text-muted-foreground" />
            </label>
            <Select value={gender} onChange={setGender} options={["All", "Male", "Female"]} />
            <Select value={status} onChange={setStatus} options={["All", "Available", "Reserved", "Sold"]} />
            <Select value={sort} onChange={setSort} options={["newest", "oldest", "price"]} labelMap={{ newest: "Newest", oldest: "Oldest", price: "Price" }} />
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-luxe">
          {isLoading ? (
            <p className="py-24 text-center text-sm text-muted-foreground">Loading puppies…</p>
          ) : list.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">No puppies match your filters.</p>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => <PuppyCard key={p.id} p={p} delay={i * 0.04} onSelect={setSelected} />)}
            </div>
          )}
        </div>
      </section>

      <PuppyModal puppy={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </SiteLayout>
  );
}

function Select<T extends string>({ value, onChange, options, labelMap }: { value: T; onChange: (v: T) => void; options: readonly T[]; labelMap?: Record<string, string> }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}
      className="h-10 border-0 bg-transparent px-2 text-xs uppercase tracking-[0.18em] outline-none">
      {options.map((o) => <option key={o} value={o}>{labelMap?.[o] ?? o}</option>)}
    </select>
  );
}
