export type SectionType =
  | "hero" | "features" | "testimonials" | "pricing"
  | "faq" | "cta" | "countdown" | "video" | "form" | "image";

export type Section =
  | { id: string; type: "hero"; eyebrow: string; headline: string; sub: string; ctaText: string; ctaHref: string }
  | { id: string; type: "features"; title: string; items: { title: string; desc: string }[] }
  | { id: string; type: "testimonials"; title: string; items: { name: string; role: string; quote: string }[] }
  | { id: string; type: "pricing"; title: string; items: { name: string; price: string; period: string; features: string[]; cta: string }[] }
  | { id: string; type: "faq"; title: string; items: { q: string; a: string }[] }
  | { id: string; type: "cta"; headline: string; sub: string; ctaText: string; ctaHref: string }
  | { id: string; type: "countdown"; headline: string; target: string }
  | { id: string; type: "video"; title: string; url: string }
  | { id: string; type: "form"; headline: string; sub: string; fields: { label: string; type: "text" | "email" | "tel" }[]; buttonText: string }
  | { id: string; type: "image"; url: string; alt: string };

export const newId = () => Math.random().toString(36).slice(2, 10);

export function defaultSection(type: SectionType): Section {
  const id = newId();
  switch (type) {
    case "hero": return { id, type, eyebrow: "NEW", headline: "Your bold headline here", sub: "A short subheadline that sells the dream.", ctaText: "Get Started", ctaHref: "#cta" };
    case "features": return { id, type, title: "Why it works", items: [
      { title: "Fast", desc: "Launch in minutes, not weeks." },
      { title: "Smart", desc: "AI-assisted from copy to layout." },
      { title: "Scalable", desc: "Grows with your business." },
    ]};
    case "testimonials": return { id, type, title: "Loved by creators", items: [
      { name: "Maya R.", role: "Coach", quote: "Went from idea to first sale in 48 hours." },
      { name: "Jordan T.", role: "Founder", quote: "It's like ClickFunnels with a brain." },
    ]};
    case "pricing": return { id, type, title: "Pricing", items: [
      { name: "Starter", price: "$29", period: "/mo", features: ["1 funnel", "AI copy", "Basic analytics"], cta: "Start" },
      { name: "Pro", price: "$79", period: "/mo", features: ["Unlimited funnels", "AI agents", "Advanced analytics"], cta: "Go Pro" },
    ]};
    case "faq": return { id, type, title: "Questions", items: [
      { q: "How fast can I launch?", a: "Most users publish their first funnel in under 30 minutes." },
      { q: "Do I need a designer?", a: "No — every block is designed to look premium out of the box." },
    ]};
    case "cta": return { id, type, headline: "Ready to launch?", sub: "Join thousands of creators building with TRENDSETTA.", ctaText: "Claim your spot", ctaHref: "#" };
    case "countdown": return { id, type, headline: "Offer ends soon", target: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString() };
    case "video": return { id, type, title: "Watch the demo", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" };
    case "form": return { id, type, headline: "Join the waitlist", sub: "Get early access and bonuses.", fields: [{ label: "Name", type: "text" }, { label: "Email", type: "email" }], buttonText: "Reserve my spot" };
    case "image": return { id, type, url: "", alt: "" };
  }
}

export const SECTION_LIBRARY: { type: SectionType; label: string; icon: string }[] = [
  { type: "hero", label: "Hero", icon: "🚀" },
  { type: "features", label: "Features", icon: "✨" },
  { type: "testimonials", label: "Testimonials", icon: "💬" },
  { type: "pricing", label: "Pricing", icon: "💎" },
  { type: "faq", label: "FAQ", icon: "❓" },
  { type: "cta", label: "CTA", icon: "🎯" },
  { type: "countdown", label: "Countdown", icon: "⏳" },
  { type: "video", label: "Video", icon: "🎬" },
  { type: "form", label: "Form", icon: "📝" },
  { type: "image", label: "Image", icon: "🖼️" },
];

export const FUNNEL_TEMPLATES: { id: string; name: string; type: string; description: string; sections: Section[] }[] = [
  {
    id: "lead", name: "Lead Magnet", type: "lead", description: "Capture emails with a free download.",
    sections: [defaultSection("hero"), defaultSection("features"), defaultSection("form"), defaultSection("faq")],
  },
  {
    id: "webinar", name: "Webinar Funnel", type: "webinar", description: "Register attendees for your live event.",
    sections: [defaultSection("hero"), defaultSection("countdown"), defaultSection("form"), defaultSection("testimonials")],
  },
  {
    id: "sales", name: "Product Sales", type: "sales", description: "Sell a digital product end-to-end.",
    sections: [defaultSection("hero"), defaultSection("video"), defaultSection("features"), defaultSection("testimonials"), defaultSection("pricing"), defaultSection("faq"), defaultSection("cta")],
  },
  {
    id: "coaching", name: "Coaching Funnel", type: "coaching", description: "Book strategy calls and discovery sessions.",
    sections: [defaultSection("hero"), defaultSection("testimonials"), defaultSection("features"), defaultSection("form"), defaultSection("faq")],
  },
  {
    id: "affiliate", name: "Affiliate Funnel", type: "affiliate", description: "Promote partner offers with high CTR.",
    sections: [defaultSection("hero"), defaultSection("features"), defaultSection("video"), defaultSection("cta")],
  },
  {
    id: "drop", name: "Dropshipping", type: "drop", description: "Single-product e-commerce funnel.",
    sections: [defaultSection("hero"), defaultSection("image"), defaultSection("features"), defaultSection("testimonials"), defaultSection("pricing"), defaultSection("cta")],
  },
  {
    id: "ai", name: "AI Offer", type: "ai", description: "Launch your AI service or tool.",
    sections: [defaultSection("hero"), defaultSection("features"), defaultSection("video"), defaultSection("pricing"), defaultSection("faq")],
  },
  {
    id: "optin", name: "Email Opt-in", type: "optin", description: "Minimalist newsletter capture page.",
    sections: [defaultSection("hero"), defaultSection("form")],
  },
];
