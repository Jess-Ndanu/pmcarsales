import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { DEALER_ADDRESS, DEALER_EMAIL, DEALER_NAME, DEALER_PHONE, DEALER_TAGLINE } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <img src={logo} alt={`${DEALER_NAME} logo`} className="h-20 w-auto" />
          <p className="mt-4 text-sm text-foreground/70 max-w-xs leading-relaxed">
            {DEALER_TAGLINE}. Hand-picked vehicles, transparent pricing, and trusted service in Mombasa.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/inventory" className="hover:text-primary">Inventory</Link></li>
            <li><Link to="/about" className="hover:text-primary">About us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Visit</h4>
          <p className="text-sm text-muted-foreground">{DEALER_ADDRESS}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Get in touch</h4>
          <p className="text-sm text-muted-foreground">{DEALER_PHONE}</p>
          <p className="text-sm text-muted-foreground">{DEALER_EMAIL}</p>
        </div>
      </div>
      <div className="border-t border-border py-5">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {DEALER_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
