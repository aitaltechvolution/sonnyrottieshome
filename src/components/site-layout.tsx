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

  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="container-luxe flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium tracking-tight">
          Sonny Rotties<span className="text-muted-foreground">Home</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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
            className="hidden rounded-none border border-gold bg-gold px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-transparent hover:text-gold md:inline-flex"
          >
            Enquire
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex h-9 w-9 items-center justify-center border border-border md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="glass md:hidden"
          >
            <div className="container-luxe flex flex-col py-3">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="border-b border-border py-3 text-sm text-foreground last:border-0"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-4 border border-gold bg-gold px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-primary-foreground"
              >
                Enquire
              </Link>
            </div>
          </motion.div>
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
          <p className="text-sm font-medium">Sonny Rotties Home</p>
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
