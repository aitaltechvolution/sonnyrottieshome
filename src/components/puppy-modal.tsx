import { Link } from "@tanstack/react-router";
import { X, ShieldCheck, Syringe, Stethoscope } from "lucide-react";
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { resolveImage, type PuppyRow } from "@/lib/puppies-api";
import { cn } from "@/lib/utils";

export function PuppyModal({
  puppy,
  onOpenChange,
}: {
  puppy: PuppyRow | null;
  onOpenChange: (open: boolean) => void;
}) {
  const isAvailable = puppy?.status === "Available";

  // Prefill the contact form: which dog, and a starter message.
  const contactSearch = puppy
    ? {
        puppy: puppy.name,
        message: `Hi, I'd like to reserve ${puppy.name}. Please send me next steps for the deposit and pickup/shipping.`,
      }
    : undefined;

  return (
    <Dialog open={!!puppy} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="duration-200" />
        <DialogPrimitive.Content
          className={cn(
            // Fixed + centered, capped to the viewport so it always fits (mobile included).
            "fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-border/60 bg-background shadow-luxe outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200 sm:max-w-lg",
          )}
        >
          {puppy && (
            <>
              <DialogTitle className="sr-only">{puppy.name}</DialogTitle>

              <div className="flex-1 overflow-y-auto">
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface sm:aspect-[4/3]">
                  <img
                    src={resolveImage(puppy)}
                    alt={puppy.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-background/60 bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur">
                    {puppy.status}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl leading-tight sm:text-3xl">{puppy.name}</h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {puppy.gender} · {puppy.age_weeks}w
                      </p>
                    </div>
                    {puppy.price != null && (
                      <p className="whitespace-nowrap font-display text-xl text-foreground/90 sm:text-2xl">
                        ${Number(puppy.price).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {puppy.description && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{puppy.description}</p>
                  )}

                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-border/60 bg-surface/60 p-4 text-sm">
                    {puppy.color && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Color</dt>
                        <dd className="mt-0.5 text-foreground">{puppy.color}</dd>
                      </div>
                    )}
                    {puppy.weight && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Weight</dt>
                        <dd className="mt-0.5 text-foreground">{puppy.weight}</dd>
                      </div>
                    )}
                    {puppy.father && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Father</dt>
                        <dd className="mt-0.5 text-foreground">{puppy.father}</dd>
                      </div>
                    )}
                    {puppy.mother && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Mother</dt>
                        <dd className="mt-0.5 text-foreground">{puppy.mother}</dd>
                      </div>
                    )}
                  </dl>

                  {(puppy.temperament || puppy.vaccination || puppy.deworming) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {puppy.temperament && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/50 px-3 py-1.5 text-[11px]">
                          <ShieldCheck className="h-3.5 w-3.5 text-gold" /> {puppy.temperament}
                        </span>
                      )}
                      {puppy.vaccination && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/50 px-3 py-1.5 text-[11px]">
                          <Syringe className="h-3.5 w-3.5 text-gold" /> {puppy.vaccination}
                        </span>
                      )}
                      {puppy.deworming && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/50 px-3 py-1.5 text-[11px]">
                          <Stethoscope className="h-3.5 w-3.5 text-gold" /> {puppy.deworming}
                        </span>
                      )}
                    </div>
                  )}

                  {!isAvailable && (
                    <p className="mt-5 rounded-xl border border-border/60 bg-surface/40 px-4 py-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
                      Currently {puppy.status}
                    </p>
                  )}
                </div>
              </div>

              {/* Sticky action bar so buttons stay reachable on small screens */}
              <div className="flex shrink-0 items-center gap-3 border-t border-border/60 bg-background p-4 sm:p-5">
                <DialogPrimitive.Close
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full gold-hairline text-sm hover:bg-surface/60 sm:flex-none sm:px-6"
                >
                  Close
                </DialogPrimitive.Close>
                {isAvailable && (
                  <DialogPrimitive.Close asChild>
                    <Link
                      to="/contact"
                      search={contactSearch}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-gold px-6 text-sm font-medium text-primary-foreground shadow-luxe hover:brightness-110"
                    >
                      Buy / Reserve {puppy.name}
                    </Link>
                  </DialogPrimitive.Close>
                )}
              </div>

              <DialogPrimitive.Close className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 text-foreground/80 backdrop-blur transition hover:bg-background hover:text-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
