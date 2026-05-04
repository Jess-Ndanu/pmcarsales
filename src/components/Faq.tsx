import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Are your vehicles inspected before sale?",
    a: "Yes. Every car passes a 150-point mechanical and cosmetic inspection before it is listed. We disclose any known issues upfront.",
  },
  {
    q: "Do you offer financing?",
    a: "We work with several local banks and SACCOs to help arrange financing. Reach out via the contact page and we'll connect you with the right partner.",
  },
  {
    q: "Can I trade in my current car?",
    a: "Absolutely. Bring your vehicle in for a free valuation and we'll offer a fair trade-in value against any car in our inventory.",
  },
  {
    q: "Is there a warranty?",
    a: "Every vehicle includes a 12-month limited powertrain warranty. Extended coverage options are available at checkout.",
  },
  {
    q: "Do you handle logbook transfer?",
    a: "Yes. We manage the full NTSA transfer process on your behalf so you drive away worry-free.",
  },
  {
    q: "Can I source a specific car you don't have in stock?",
    a: "Yes. Tell us the make, model, year and budget — our buying team sources vehicles to order, both locally and imported.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-4xl px-5 md:px-10 py-[60px] md:py-24">
      <div className="text-center mb-10 md:mb-14">
        <p className="text-sm font-semibold italic text-primary">Got questions?</p>
        <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight">
          Frequently Asked
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-left font-display text-base md:text-lg font-bold hover:text-primary hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-foreground/75 leading-relaxed text-sm md:text-base">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
