import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Sonny Rotties Home" }, { name: "description", content: "Terms and conditions for Sonny Rotties Home." }] }),
  component: () => (
    <SiteLayout>
      <section className="py-24">
        <div className="container-luxe max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Legal</p>
          <h1 className="font-display text-5xl"><span className="text-gradient-gold">Terms & Conditions</span></h1>
          <div className="prose prose-invert mt-10 max-w-none text-muted-foreground [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4">
            <p>By using this website you agree to the following terms.</p>
            <h2>Enquiries & Reservations</h2>
            <p>All puppies are subject to availability. A signed contract and non-refundable deposit reserves a specific puppy.</p>
            <h2>Payments</h2>
            <p>No online payments are processed through this website. Payment arrangements are made privately with confirmed clients.</p>
            <h2>Shipping & Pickup</h2>
            <p>Shipping is available at buyer's expense. Pickup is available by appointment at our Texas facility.</p>
            <h2>Health Guarantee</h2>
            <p>Refer to our Health Guarantee page and the written contract provided at pickup.</p>
            <h2>Intellectual Property</h2>
            <p>All content, photography and branding on this website are the property of Sonny Rotties Home.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  ),
});
