import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Are your vehicles inspected before sale?",
    a: "Yes, absolutely. Every vehicle in our yard undergoes a rigorous multi-point inspection covering the engine, transmission, suspension, electronics, and braking systems. For imported units, we also verify official QISJ/JEVIC inspection certificates to guarantee genuine mileage and structural integrity.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes, we offer highly flexible financing options. You can purchase via Hire Purchase (with a standard deposit of 40% to 50% and the balance cleared in 12–24 months), or through major local banks and asset-financing SACCOs. Our team handles the documentation to get you approved quickly.",
  },
  {
    q: "Can I trade in my current car?",
    a: "Yes! Bring your vehicle to our showroom for a free, transparent valuation. Once we evaluate its condition and market value, we will deduct that amount from the price of your upgraded car. You simply pay the difference or finance it.",
  },
  {
    q: "Is there a warranty?",
    a: "We stand by our quality. All our certified clean dealership units come with a standard dealership warranty covering the engine and gearbox. Specific terms vary based on whether the vehicle is a fresh import or a locally used unit.",
  },
  {
    q: "Do you handle logbook transfer?",
    a: "Yes, we take care of the entire legal process end-to-end. For cash purchases, we initiate the transfer via the NTSA TIMS / eCitizen portal immediately so the logbook is legally in your name before you leave the yard. For financed vehicles, we coordinate directly with the bank/SACCO.",
  },
  {
    q: "Can I source a specific car you don't have in stock?",
    a: "Definitely. If a specific model, color, or trim isn't currently in our inventory, our specialized import team can source it directly from auctions in Japan, the UK, or Thailand. We manage shipping, customs clearance, and port delivery, saving you time and money.",
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
