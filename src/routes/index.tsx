import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { AISection } from "@/components/AISection";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTAFooter } from "@/components/CTAFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRENDSETTA SYSTEM™ — Build Your Digital Empire" },
      {
        name: "description",
        content:
          "All-in-one AI platform for creators: launch funnels, websites, digital products, content automation and CRM from one minimalist workspace.",
      },
      { property: "og:title", content: "TRENDSETTA SYSTEM™ — Build Your Digital Empire" },
      {
        property: "og:description",
        content:
          "Funnels, websites, AI Studio, CRM and automation — the operating system for modern digital businesses.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen relative">
      <SiteNav />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <AISection />
        <Pricing />
        <FAQ />
        <CTAFooter />
      </main>
    </div>
  );
}
