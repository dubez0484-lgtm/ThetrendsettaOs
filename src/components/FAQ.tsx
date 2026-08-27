import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is TRENDSETTA SYSTEM™?",
    a: "An all-in-one operating system for creators, coaches and digital businesses to launch websites, funnels, products and AI workflows from one minimalist workspace.",
  },
  {
    q: "Do I need technical skills?",
    a: "Not at all. Drag-and-drop builders, AI generators and ready-made templates make it possible to launch in an afternoon.",
  },
  {
    q: "Can I sell digital products and courses?",
    a: "Yes. Upload PDFs, host courses, sell templates and toolkits — with automatic delivery and built-in checkout.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Starter plan is free forever — no credit card required.",
  },
  {
    q: "Does it work on mobile?",
    a: "TRENDSETTA is mobile-first. Manage your business, AI workflows and analytics from any device.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="text-sm text-primary font-medium mb-3">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Questions, <span className="text-gradient">answered.</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="glass rounded-2xl px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/5">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
