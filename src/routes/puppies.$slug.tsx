import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck, Syringe, Stethoscope, Truck, MapPin, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { PuppyCard } from "@/components/puppy-card";
import { puppyBySlugQueryOptions, puppiesQueryOptions, resolveImage, resolveGallery, type PuppyRow } from "@/lib/puppies-api";
import { PuppyModal } from "@/components/puppy-modal";

export const Route = createFileRoute("/puppies/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Rottweiler Puppy | Sonny Rotties Home` },
      { name: "description", content: "Premium Rottweiler puppy available at Sonny Rotties Home in Texas. Health guaranteed and vet-checked." },
    ],
  }),
  component: PuppyDetail,
});

function PuppyDetail() {
  const { slug } = Route.useParams();
  const { data: puppy, isLoading } = useQuery(puppyBySlugQueryOptions(slug));
  const { data: allPuppies = [] } = useQuery(puppiesQueryOptions());
  const gallery = puppy ? resolveGallery(puppy) : [];
  const [active, setActive] = useState<string | null>(null);
  const activeImg = active ?? gallery[0] ?? "";
  const [selected, setSelected] = useState<PuppyRow | null>(null);

  if (isLoading) {
    return <SiteLayout><div className="container-luxe py-40 text-center text-muted-foreground">Loading…</div></SiteLayout>;
  }

  if (!puppy) {
    return (
      <SiteLayout>
        <div className="container-luxe py-40 text-center">
          <h1 className="font-display text-5xl">Puppy not found</h1>
          <Link to="/puppies" className="mt-8 inline-block text-gold">← Back to puppies</Link>
        </div>
      </SiteLayout>
    );
  }

  const specs: [string, string | number][] = [
    ["Gender", puppy.gender],
    ["Age", `${puppy.age_weeks} weeks`],
    ...(puppy.dob ? [["Date of Birth", new Date(puppy.dob).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })] as [string, string]] : []),
    ...(puppy.color ? [["Color", puppy.color] as [string, string]] : []),
    ...(puppy.weight ? [["Weight", puppy.weight] as [string, string]] : []),
    ["Availability", puppy.status],
    ...(puppy.father ? [["Father", puppy.father] as [string, string]] : []),
    ...(puppy.mother ? [["Mother", puppy.mother] as [string, string]] : []),
  ];

  const emailSubject = encodeURIComponent(`Enquiry — ${puppy.name} (${puppy.slug})`);
  const emailBody = encodeURIComponent(
    `Hi Sonny Rotties Home,\n\nI'd like to reserve ${puppy.name}. Please share next steps for the reservation deposit and pickup or shipping.\n\nMy name:\nPhone:\nCity/State:\n\nThank you.`
  );
  const mailto = `mailto:sonnyrottieshome@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  return (
    <SiteLayout>
      <section className="pt-8">
        <div className="container-luxe">
          <Link to="/puppies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> All puppies
          </Link>
        </div>
      </section>

      <section className="py-10">
        <div className="container-luxe grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div layoutId={activeImg} className="overflow-hidden rounded-[2rem] border border-border/60">
              <img src={activeImg || resolveImage(puppy)} alt={puppy.name} width={1024} height={1280} className="aspect-[4/5] w-full object-cover" />
            </motion.div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {gallery.map((g) => (
                  <button key={g} onClick={() => setActive(g)} className={`overflow-hidden rounded-2xl border transition ${activeImg === g ? "border-gold" : "border-border/60"}`}>
                    <img src={g} alt="" loading="lazy" width={400} height={400} className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{puppy.status}</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl"><span className="text-gradient-gold">{puppy.name}</span></h1>
            {puppy.price != null && <p className="mt-4 font-display text-3xl text-foreground/90">${Number(puppy.price).toLocaleString()}</p>}
            {puppy.description && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{puppy.description}</p>}

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-border/60 bg-surface/60 p-6">
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</dt>
                  <dd className="mt-1 text-sm text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 space-y-3">
              {puppy.temperament && <Row label="Temperament" value={puppy.temperament} />}
              {puppy.vaccination && <Row label="Vaccination" value={puppy.vaccination} />}
              {puppy.deworming && <Row label="Deworming" value={puppy.deworming} />}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {([
                [ShieldCheck, "1-Year Health"],
                [Stethoscope, "Vet Checked"],
                [Syringe, "Vaccinated"],
                [Truck, "Shipping Available"],
                [MapPin, "Pickup Available"],
              ] as const).map(([Icon, t]) => (
                <div key={t} className="flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-4 py-2 text-xs">
                  <Icon className="h-3.5 w-3.5 text-gold" /> {t}
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-gold/40 bg-surface/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Reserve by email</p>
              <h3 className="mt-2 font-display text-2xl">Purchases are handled by email only</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We don't process payments online. Send us an email — we'll reply within 24 hours with reservation and pickup or shipping details.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={mailto}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-luxe hover:brightness-110">
                  <Mail className="h-4 w-4" /> Email to reserve {puppy.name}
                </a>
                <Link to="/contact" search={{ puppy: puppy.name }}
                  className="inline-flex items-center gap-2 rounded-full gold-hairline px-6 py-3 text-sm hover:bg-surface/60">
                  Or use enquiry form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(() => {
        const similar = allPuppies.filter((x) => x.slug !== puppy.slug).slice(0, 3);
        if (similar.length === 0) return <div className="pb-24" />;
        return (
          <section className="py-20 border-t border-border/60">
            <div className="container-luxe">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">You may also love</p>
                  <h2 className="mt-3 font-display text-4xl"><span className="text-gradient-gold">Similar puppies</span></h2>
                </div>
                <Link to="/puppies" className="inline-flex items-center gap-2 rounded-full gold-hairline px-6 py-3 text-sm hover:bg-surface/60">
                  View all available puppies <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((p, i) => <PuppyCard key={p.id} p={p} delay={i * 0.08} onSelect={setSelected} />)}
              </div>
            </div>
          </section>
        );
      })()}

      <PuppyModal puppy={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
      <p className="text-[11px] uppercase tracking-widest text-gold">{label}</p>
      <p className="mt-1 text-sm text-foreground/90">{value}</p>
    </div>
  );
}
