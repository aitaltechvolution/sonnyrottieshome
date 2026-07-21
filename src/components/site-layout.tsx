import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/puppies", label: "Puppies" },
  { to: "/health-guarantee", label: "Health" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setOpen(false), [path]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="container-luxe flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Sonny Rotties Home" className="h-9 w-auto object-contain" />
        </Link>

        {/* Desktop nav — only visible on large screens */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`text-xs uppercase tracking-[0.2em] transition ${
                  active ? "text-gold" : "text-muted-foreground hover:text-gold"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden rounded-none border border-gold bg-gold px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-transparent hover:text-gold lg:inline-flex"
          >
            Enquire
          </Link>
          {/* Hamburger — visible on mobile AND tablet (below lg) */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center border border-border lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile + Tablet drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-72 flex-col border-l border-border bg-background shadow-luxe lg:hidden"
            >
              <nav className="flex flex-col gap-1 p-6">
                {NAV.map((n) => {
                  const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      className={`rounded-xl px-4 py-3 text-sm uppercase tracking-[0.18em] transition ${
                        active
                          ? "bg-gold/15 text-gold"
                          : "text-foreground/80 hover:bg-surface/60 hover:text-gold"
                      }`}
                    >
                      {n.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-border p-6">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block w-full border border-gold bg-gold px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-transparent hover:text-gold"
                >
                  Enquire Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-4">
        <div>
          <img src="/logo.jpg" alt="Sonny Rotties Home" className="h-10 w-auto object-contain" />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Family-raised Rottweiler puppies in Texas. Ethical breeding, healthy bloodlines.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Explore</h4>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="text-foreground/80 hover:text-foreground">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Contact</h4>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +1 (571) 675-3922</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> sonnyrottieshome@gmail.com</li>
            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Texas, USA</li>
            <li>
              <a href="https://www.instagram.com/sonny_rotties_home" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
                <Instagram className="h-3.5 w-3.5" /> @sonny_rotties_home
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Policies</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
            <li><Link to="/health-guarantee" className="hover:text-foreground">Health Guarantee</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-luxe flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Sonny Rotties Home.</p>
          <p>Crafted in Texas.</p>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}