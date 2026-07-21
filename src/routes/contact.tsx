import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, Mail, Instagram, MapPin, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ puppy: z.string().optional(), message: z.string().optional() });

export const Route = createFileRoute("/contact")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Contact — Sonny Rotties Home" },
      { name: "description", content: "Enquire about our Rottweiler puppies. Reach us by phone, email or Instagram — based in Texas, USA." },
      { property: "og:title", content: "Contact Sonny Rotties Home" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().min(7, "Phone required").max(30),
  puppy: z.string().max(80).optional(),
  message: z.string().trim().min(10, "Please share a few details").max(1000),
});
type FormValues = z.infer<typeof schema>;

function ContactPage() {
  const search = Route.useSearch();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { puppy: search.puppy ?? "", message: search.message ?? "" },
  });

  const onSubmit = async (data: FormValues) => {
    const { error } = await supabase.from("enquiries").insert({
      name: data.name, email: data.email, phone: data.phone,
      puppy_name: data.puppy || null, message: data.message,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Enquiry sent — we'll be in touch shortly.");
    reset({ name: "", email: "", phone: "", puppy: "", message: "" });
  };

  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="container-luxe">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl"><span className="text-gradient-gold">Let's talk.</span></h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Serious enquiries only. We personally reply within 24 hours.
          </p>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-border/60 bg-surface/60 p-8 md:p-10">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Name" error={errors.name?.message}><input {...register("name")} className={input} /></Field>
                <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} className={input} /></Field>
                <Field label="Email" error={errors.email?.message} className="md:col-span-2"><input type="email" {...register("email")} className={input} /></Field>
                <Field label="Desired Puppy (optional)" error={errors.puppy?.message} className="md:col-span-2"><input {...register("puppy")} className={input} placeholder="e.g. Duke" /></Field>
                <Field label="Message" error={errors.message?.message} className="md:col-span-2">
                  <textarea rows={5} {...register("message")} className={`${input} resize-none py-3`} />
                </Field>
              </div>
              <button disabled={isSubmitting} className="mt-6 w-full rounded-full bg-gold px-7 py-4 text-sm font-medium text-primary-foreground shadow-luxe hover:brightness-110 disabled:opacity-60">
                {isSubmitting ? "Sending…" : "Send Enquiry"}
              </button>
            </form>

            <aside className="space-y-4">
              <Info icon={Phone} label="Phone" value="+1 (571) 675-3922" href="tel:+15716753922" />
              <Info icon={Mail} label="Email" value="sonnyrottieshome@gmail.com" href="mailto:sonnyrottieshome@gmail.com" />
              <Info icon={Instagram} label="Instagram" value="@sonny_rotties_home" href="https://www.instagram.com/sonny_rotties_home" />
              <Info icon={MapPin} label="Location" value="Texas, USA" />
              <div className="rounded-2xl border border-border/60 bg-surface/60 p-6">
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold"><Clock className="h-4 w-4" /> Hours</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li>Mon–Fri · 9am – 7pm CT</li>
                  <li>Sat · 10am – 5pm CT</li>
                  <li>Sun · By appointment</li>
                </ul>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border/60">
                <iframe title="Texas map" src="https://www.google.com/maps?q=Texas%2C+USA&output=embed" loading="lazy" className="h-64 w-full" />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

const input = "h-11 w-full rounded-xl border border-border/60 bg-background/60 px-4 text-sm outline-none focus:border-gold";

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Info({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-surface/60 p-5 transition hover:border-gold/40">
      <span className="grid h-11 w-11 place-items-center rounded-full gold-hairline bg-background/60"><Icon className="h-5 w-5 text-gold" /></span>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer">{inner}</a> : inner;
}
