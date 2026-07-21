import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { puppiesQueryOptions, testimonials, type PuppyRow } from "@/lib/puppies-api";
import { PuppyCard, Section } from "@/components/puppy-card";
import { PuppyModal } from "@/components/puppy-modal";
import hero from "@/assets/hero-puppy.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sonny Rotties Home — Rottweiler Puppies in Texas" },
      { name: "description", content: "Family-raised, vet-checked Rottweiler puppies from healthy Texas bloodlines. 1-Year Health Guarantee. Nationwide shipping." },
      { property: "og:title", content: "Sonny Rotties Home — Rottweiler Puppies" },
      { property: "og:description", content: "Family-raised Rottweiler puppies in Texas." },
    ],
  }),
  component: HomePage,
});

const promises = [
  ["01", "Family Raised", "Puppies grow up inside our home, socialized daily."],
  ["02", "Texas Based", "Located in the heart of Texas — visits by appointment."],
  ["03", "Vet Checked", "Comprehensive veterinary examinations before departure."],
  ["04", "Health Tested", "Screened bloodlines with verified clearances."],
  ["05", "1-Year Guarantee", "A comprehensive one-year genetic health guarantee."],
  ["06", "Lifetime Support", "Ongoing guidance for the life of your Rottweiler."],
] as const;

function HomePage() {
  const { data: puppies = [] } = useQuery(puppiesQueryOptions());
  const featured = puppies.filter((p) => p.featured).slice(0, 6);
  const [selected, setSelected] = useState<PuppyRow | null>(null);

  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden">
        <div className="container-luxe grid min-h-[88vh] gap-10 py-20 md:grid-cols-2 md:items-end md:py-28">
          <div className="flex flex-col justify-end">
            <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Texas · Est. 2018
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
            >
              Rottweiler puppies,<br />raised with intention.
            </motion.h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              Healthy bloodlines. Family raised. Vet checked. Ready for loving homes.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to="/puppies"
                className="group inline-flex items-center gap-3 border border-gold bg-gold px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-transparent hover:text-gold"
              >
                View Puppies <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="text-xs uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Contact
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-[70vh]">
            <img
              src={hero}
              alt="Rottweiler puppy"
              width={1600}
              height={1808}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <Section eyebrow="Principles" title="The standard we hold ourselves to.">
        <div className="grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {promises.map(([num, title, text]) => (
            <div key={title} className="p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{num}</p>
              <h3 className="mt-6 text-lg">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Featured"
        title="Available puppies."
        action={
          <Link to="/puppies" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground">
            View all <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </Link>
        }
      >
        {featured.length === 0 ? (
          <p className="py-12 text-sm text-muted-foreground">No featured puppies yet.</p>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => <PuppyCard key={p.id} p={p} delay={i * 0.04} onSelect={setSelected} />)}
          </div>
        )}
      </Section>

      <PuppyModal puppy={selected} onOpenChange={(open) => !open && setSelected(null)} />

      <Section eyebrow="Testimonials" title="Words from our families.">
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="border-t border-border pt-6">
              <div className="flex gap-0.5 text-foreground">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
              </div>
              <p className="mt-6 text-base leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-6 text-xs uppercase tracking-[0.18em]">
                <p className="text-foreground">{t.name}</p>
                <p className="mt-1 text-muted-foreground">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-t border-border py-24 md:py-32">
        <div className="container-luxe flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-4xl leading-tight md:text-5xl">
            Ready to welcome your new companion?
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/puppies" className="border border-gold bg-gold px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-transparent hover:text-gold">
              View Puppies
            </Link>
            <Link to="/contact" className="border border-border px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-foreground transition hover:border-gold hover:text-gold">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
