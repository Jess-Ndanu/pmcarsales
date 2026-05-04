import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, MessageCircle, Youtube, Music2 } from "lucide-react";
import logo from "@/assets/logo.png";
import {
  DEALER_ADDRESS,
  DEALER_EMAIL,
  DEALER_NAME,
  DEALER_PHONE,
  DEALER_TAGLINE,
  DEALER_WHATSAPP,
} from "@/lib/format";

const socials = [
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com", Icon: Music2 },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-surface border-t border-border">
      {/* Thin red accent bar — the only red up top */}
      <div className="h-[3px] w-full bg-primary" />

      <div className="mx-auto max-w-7xl px-5 md:px-10 py-14 grid gap-10 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <img src={logo} alt={`${DEALER_NAME} logo`} className="h-20 w-auto" />
          <p className="mt-4 text-sm text-foreground max-w-sm leading-relaxed">
            {DEALER_TAGLINE}. Hand-picked vehicles, transparent pricing, and trusted service in Mombasa.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="md:col-span-2">
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-heading">Explore</h4>
          <ul className="space-y-2 text-sm text-foreground">
            <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
            <li><Link to="/inventory" className="hover:text-primary transition">Inventory</Link></li>
            <li><Link to="/about" className="hover:text-primary transition">About us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
          </ul>
        </div>

        {/* Visit */}
        <div className="md:col-span-3">
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-heading">Visit</h4>
          <p className="flex items-start gap-3 text-sm text-foreground">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <span>{DEALER_ADDRESS}</span>
          </p>
        </div>

        {/* Contact */}
        <div className="md:col-span-3">
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-heading">Get in touch</h4>
          <ul className="space-y-3 text-sm text-foreground">
            <li>
              <a href={`tel:${DEALER_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-primary transition">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {DEALER_PHONE}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${DEALER_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-primary transition"
              >
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${DEALER_EMAIL}`} className="flex items-center gap-3 hover:text-primary transition break-all">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                {DEALER_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {DEALER_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            {DEALER_TAGLINE} — Mombasa, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
