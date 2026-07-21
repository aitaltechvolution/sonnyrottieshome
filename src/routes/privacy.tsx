import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Sonny Rotties Home" }, { name: "description", content: "Sonny Rotties Home privacy policy." }] }),
  component: () => (
    <SiteLayout>
      <section className="py-24">
        <div className="container-luxe max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Legal</p>
          <h1 className="font-display text-5xl"><span className="text-gradient-gold">Privacy Policy</span></h1>
          <div className="prose prose-invert mt-10 max-w-none text-muted-foreground [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4">
            <p>Sonny Rotties Home respects your privacy. This policy explains what information we collect, how we use it, and your rights.</p>
            <h2>Information We Collect</h2>
            <p>Contact information you voluntarily provide via our enquiry form: name, email, phone, message content, and puppy of interest.</p>
            <h2>How We Use It</h2>
            <p>Solely to respond to your enquiry and, if you become a client, to communicate about your puppy. We do not sell or share your information.</p>
            <h2>Cookies</h2>
            <p>We use essential cookies to remember preferences such as your theme selection.</p>
            <h2>Contact</h2>
            <p>Questions? Email sonnyrottieshome@gmail.com.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  ),
});
