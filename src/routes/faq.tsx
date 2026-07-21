import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/lib/puppies-api";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Sonny Rotties Home" },
      { name: "description", content: "Answers to the most common questions about our Rottweiler puppies, reservations, shipping, and care." },
      { property: "og:title", content: "FAQ — Sonny Rotties Home" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="container-luxe max-w-4xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Questions</p>
          <h1 className="font-display text-5xl md:text-6xl"><span className="text-gradient-gold">Frequently Asked</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">Everything you need to know before welcoming a Sonny Rotties puppy home.</p>

          <div className="mt-12 rounded-3xl border border-border/60 bg-surface/60 p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`q-${i}`}>
                  <AccordionTrigger className="text-left font-display text-lg hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
