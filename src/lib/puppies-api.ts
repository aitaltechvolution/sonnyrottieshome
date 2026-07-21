import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Real puppy images
import lucyImg   from "@/assets/lucy.jpg";
import maggieImg from "@/assets/maggie.jpg";
import maxImg    from "@/assets/max.jpg";
import brunoImg  from "@/assets/bruno.jpg";
import lunaImg   from "@/assets/luna.jpg";
import lacyImg   from "@/assets/lacy.jpg";
import marioImg  from "@/assets/mario.jpg";
import zizaImg   from "@/assets/ziza.jpg";
import mollyImg  from "@/assets/molly.jpg";
import taraImg   from "@/assets/tara.jpg";
import keshImg   from "@/assets/kesh.jpg";
import ayimImg   from "@/assets/ayim.jpg";

export type PuppyStatus = "Available" | "Reserved" | "Sold";

export type PuppyRow = {
  id: string;
  slug: string;
  name: string;
  gender: "Male" | "Female";
  age_weeks: number;
  dob: string | null;
  color: string | null;
  weight: string | null;
  price: number | null;
  status: PuppyStatus;
  featured: boolean;
  image_url: string | null;
  gallery: string[];
  description: string | null;
  temperament: string | null;
  vaccination: string | null;
  deworming: string | null;
  father: string | null;
  mother: string | null;
};

// Maps slug → bundled image for all 12 real puppies
const fallbackBySlug: Record<string, string> = {
  lucy:   lucyImg,
  maggie: maggieImg,
  max:    maxImg,
  bruno:  brunoImg,
  luna:   lunaImg,
  lacy:   lacyImg,
  mario:  marioImg,
  ziza:   zizaImg,
  molly:  mollyImg,
  tara:   taraImg,
  kesh:   keshImg,
  ayim:   ayimImg,
};

const fallbackPool = [lucyImg, maggieImg, maxImg, brunoImg, lunaImg, lacyImg, marioImg, zizaImg, mollyImg, taraImg, keshImg, ayimImg];

export function resolveImage(p: Pick<PuppyRow, "slug" | "image_url">): string {
  if (p.image_url && p.image_url.length > 0) return p.image_url;
  return fallbackBySlug[p.slug] ?? fallbackPool[0];
}

export function resolveGallery(p: Pick<PuppyRow, "slug" | "image_url" | "gallery">): string[] {
  const primary = resolveImage(p);
  const extras = (p.gallery ?? []).filter((g) => g && g.length > 0 && g !== primary);
  return [primary, ...extras];
}

export const puppiesQueryOptions = () =>
  queryOptions({
    queryKey: ["puppies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("puppies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PuppyRow[];
    },
  });

export const puppyBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["puppies", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("puppies")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as PuppyRow | null;
    },
  });

export const testimonials = [
  { id: "1", name: "Marcus & Elena Rivera", location: "Austin, TX",
    quote: "Our experience with Sonny Rotties Home was extraordinary. The professionalism, the health of our puppy, and the ongoing support — nothing short of luxury." },
  { id: "2", name: "Jonathan Pierce", location: "Dallas, TX",
    quote: "From the first call to the day we brought Kaiser home, every detail was handled with elegance. A truly premium breeder." },
  { id: "3", name: "Sophia Bennett", location: "Houston, TX",
    quote: "Impeccable bloodlines and a beautifully-tempered puppy. Sonny Rotties Home sets the standard." },
];

export const faqs = [
  { q: "Do you ship your puppies?", a: "Yes. We offer safe, climate-controlled ground and flight-nanny shipping across the United States, arranged after your reservation is confirmed." },
  { q: "Can I visit in person?", a: "Absolutely. In-person visits at our Texas facility are welcomed by appointment for serious enquiries." },
  { q: "How do I reserve a puppy?", a: "Email us about the puppy you're interested in. We'll review, schedule a call, and — if it's a good match — accept a non-refundable reservation deposit. All purchases are handled by email; we do not process payments online." },
  { q: "How old are puppies before leaving?", a: "Our puppies go home at 8 weeks minimum, fully weaned, vet-checked and up to date on age-appropriate vaccinations and deworming." },
  { q: "What is included with each puppy?", a: "Health records, vaccination and deworming schedule, starter food, blanket with mother's scent, AKC-eligible registration paperwork, and our 1-Year Health Guarantee." },
  { q: "What does the Health Guarantee cover?", a: "A comprehensive 1-Year genetic health guarantee — full details are provided in our Health Guarantee page and contract." },
  { q: "What is the pickup process?", a: "Pickups are by appointment at our Texas facility. We'll walk you through everything: transition food, care schedule, and future support." },
];