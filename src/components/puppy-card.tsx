import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { resolveImage, type PuppyRow } from "@/lib/puppies-api";

export function PuppyCard({
  p,
  delay = 0,
  onSelect,
}: {
  p: PuppyRow;
  delay?: number;
  onSelect: (p: PuppyRow) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
    >
      <button
        type="button"
        onClick={() => onSelect(p)}
        className="group block w-full text-left"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <img
            src={resolveImage(p)}
            alt={p.name}
            loading="lazy"
            width={1024}
            height={1280}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute left-3 top-3 rounded-none border border-background/60 bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur">
            {p.status}
          </span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-medium text-foreground">{p.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {p.gender} · {p.age_weeks}w
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>
      </button>
    </motion.div>
  );
}

export function Section({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-luxe">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>
            <h2 className="max-w-2xl text-3xl leading-tight md:text-4xl">{title}</h2>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
