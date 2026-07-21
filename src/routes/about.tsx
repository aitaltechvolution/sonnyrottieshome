import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SiteLayout } from "@/components/site-layout";
import banner from "@/assets/about-banner.jpg";
import lucyImg  from "@/assets/lucy.jpg";
import brunoImg from "@/assets/bruno.jpg";
import lacyImg  from "@/assets/lacy.jpg";
import mollyImg from "@/assets/molly.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Sonny Rotties Home" },
      { name: "description", content: "Meet Sonny Rotties Home — a family-run Texas Rottweiler breeder devoted to health, temperament and ethical breeding." },
      { property: "og:title", content: "About Sonny Rotties Home" },
      { property: "og:description", content: "Family-run Texas Rottweiler breeder." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={banner} alt="Texas ranch" width={1600} height={900} className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="container-luxe py-32 md:py-48">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-xs uppercase tracking-[0.3em] text-gold">Our Story</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl font-display text-5xl md:text-7xl">
            <span className="text-gradient-gold">A family devoted</span>
            <br />
            <span className="text-gradient-white">to the Rottweiler.</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-24">
        <div className="container-luxe grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">Our <span className="text-gradient-gold">Mission</span></h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We exist to raise exceptional Rottweiler puppies — healthy, well-tempered, and prepared for a lifetime of loyal companionship. Every pairing is intentional, every puppy nurtured as part of our family.
            </p>
          </div>
          <div>
            <h2 className="font-display text-4xl">Our <span className="text-gradient-gold">Vision</span></h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              To set the standard for premium Rottweiler breeding in Texas — through transparency, ethics, and an unwavering commitment to each family we serve.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface/40">
        <div className="container-luxe">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Values</p>
          <h2 className="font-display text-4xl md:text-5xl">What we <span className="text-gradient-gold">stand for</span></h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["Health First", "Every pairing is screened; every puppy is vet-verified."],
              ["Family Raised", "In-home socialization with children, sounds, and daily life."],
              ["Ethical Breeding", "Selective, limited litters — never volume-driven."],
              ["Transparency", "Full records, honest conversation, lifelong openness."],
              ["Lifetime Support", "You are never alone with your Sonny Rotties puppy."],
              ["Texas Roots", "Bred and raised on our Texas property with pride."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-border/60 bg-background/60 p-8">
                <h3 className="font-display text-xl text-gold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-luxe">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {[lucyImg, brunoImg, lacyImg, mollyImg].map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="aspect-square overflow-hidden rounded-2xl">
                <img src={src} alt="Rottweiler puppy" loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-luxe">
          <div className="rounded-[2rem] border border-border/60 bg-surface/60 p-12 text-center md:p-16">
            <h2 className="font-display text-4xl md:text-5xl">Ready to meet <span className="text-gradient-gold">your puppy?</span></h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/puppies" className="rounded-full bg-gold px-7 py-4 text-sm font-medium text-primary-foreground shadow-luxe">View Puppies</Link>
              <Link to="/contact" className="rounded-full gold-hairline bg-background/40 px-7 py-4 text-sm font-medium">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
