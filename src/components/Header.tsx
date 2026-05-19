import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, MapPin, Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { DEALER_NAME, DEALER_PHONE, DEALER_ADDRESS, DEALER_EMAIL } from "@/lib/format";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/inventory", label: "Inventory" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Top utility bar — contact info, hidden on small screens */}
      <div
        className={cn(
          "hidden md:block w-full bg-foreground text-background/90 transition-all duration-300 overflow-hidden",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 md:px-8 text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${DEALER_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5" />
              <span className="font-medium">{DEALER_PHONE}</span>
            </a>
            <a href={`mailto:${DEALER_EMAIL}`} className="hidden lg:flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5" />
              <span className="font-medium">{DEALER_EMAIL}</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-background/70">
            <MapPin className="h-3.5 w-3.5" />
            <span>{DEALER_ADDRESS}</span>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-md"
            : "bg-background/40 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo + brand */}
          <Link to="/" className="flex items-center gap-3 group" aria-label={DEALER_NAME}>
            <img
              src={logo}
              alt={`${DEALER_NAME} logo — Used Car Dealer in Mombasa Kenya`}
              className="h-11 w-auto md:h-14 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base md:text-lg font-extrabold tracking-tight text-foreground">
                {DEALER_NAME}
              </span>
              <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Drive Your Dream
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-primary bg-primary/5" }}
                activeOptions={{ exact: item.to === "/" }}
                className="relative px-4 py-2 text-sm font-semibold text-foreground/75 hover:text-primary rounded-full transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href={`tel:${DEALER_PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">Call us</span>
            </a>
            <Link
              to="/inventory"
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              Browse Cars
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out border-t border-border bg-background",
            open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navItems.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-primary bg-primary/10" }}
                activeOptions={{ exact: item.to === "/" }}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold text-foreground/85 hover:bg-muted transition-colors"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {item.label}
                <ArrowRight className="h-4 w-4 opacity-40" />
              </Link>
            ))}

            <Link
              to="/inventory"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Browse Cars
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-4 grid gap-2 border-t border-border pt-4 text-sm">
              <a href={`tel:${DEALER_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-3 px-2 py-2 text-foreground/80">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-semibold">{DEALER_PHONE}</span>
              </a>
              <a href={`mailto:${DEALER_EMAIL}`} className="flex items-center gap-3 px-2 py-2 text-foreground/80">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-semibold break-all">{DEALER_EMAIL}</span>
              </a>
              <div className="flex items-center gap-3 px-2 py-2 text-foreground/60">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{DEALER_ADDRESS}</span>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
