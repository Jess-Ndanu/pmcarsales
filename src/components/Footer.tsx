import { Link } from "@tanstack/react-router";
import { DEALER_ADDRESS, DEALER_EMAIL, DEALER_NAME, DEALER_PHONE } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-display font-bold">
              A
            </span>
            <span className="font-display text-lg font-bold">{DEALER_NAME}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Hand-picked vehicles, transparent pricing, and white-glove service since 2008.
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
