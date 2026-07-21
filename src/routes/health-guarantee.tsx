import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { ShieldCheck, Stethoscope, Syringe, Utensils, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/health-guarantee")({
  head: () => ({
    meta: [
      { title: "Health Guarantee — Sonny Rotties Home" },
      { name: "description", content: "Our 1-Year Health Guarantee, vaccination and vet examination standards, and our nutrition and care commitments." },
      { property: "og:title", content: "Health Guarantee — Sonny Rotties Home" },
    ],
  }),
  component: HealthPage,
});

const items = [
  { icon: ShieldCheck, title: "1-Year Health Guarantee", text: "Every Sonny Rotties puppy is protected by a comprehensive one-year genetic health guarantee — full terms provided at pickup." },
  { icon: Syringe, title: "Vaccinations", text: "Age-appropriate vaccinations administered per veterinary protocol, with complete written records provided." },
  { icon: Stethoscope, title: "Vet Examinations", text: "Multiple veterinary examinations from birth through adoption, ensuring each puppy is in excellent health." },
  { icon: Utensils, title: "Nutrition", text: "Premium veterinary-recommended nutrition — the same food we send you home with to ensure a smooth transition." },
  { icon: ClipboardCheck, title: "Customer Responsibilities", text: "Continuing vet visits, appropriate nutrition, safe housing, and prompt follow-through on wellness care." },
];

function HealthPage() {
  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="container-luxe max-w-4xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Our Commitment</p>
          <h1 className="font-display text-5xl md:text-6xl"><span className="text-gradient-gold">Health Guarantee</span></h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Our commitment to your puppy's health begins long before you meet them — and continues for the rest of their life.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-luxe grid gap-6 md:grid-cols-2">
          {items.map((it) => (
            <div key={it.title} className="rounded-3xl border border-border/60 bg-surface/60 p-8">
              <it.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-6 font-display text-2xl">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-32">
        <div className="container-luxe">
          <div className="rounded-3xl border border-border/60 bg-surface/40 p-10">
            <h2 className="font-display text-3xl text-gold">Guarantee Terms</h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>• The 1-Year Health Guarantee covers life-threatening congenital or genetic defects.</li>
              <li>• Buyer agrees to a licensed veterinarian examination within 72 hours of receipt.</li>
              <li>• Puppy must remain on the recommended nutrition and vaccination schedule.</li>
              <li>• Replacement puppy of comparable value provided in the rare event of a qualifying claim.</li>
              <li>• Complete written contract provided at pickup or shipment.</li>
            </ul>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
