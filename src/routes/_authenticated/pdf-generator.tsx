import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { FileText, Sparkles, Download, Palette } from "lucide-react";

export const Route = createFileRoute("/_authenticated/pdf-generator")({
  head: () => ({ meta: [{ title: "PDF Generator — THETRENDSETTA SYSTEM™" }] }),
  component: () => (
    <DashboardLayout>
      <ComingSoon
        eyebrow="Document studio"
        title="PDF Generator"
        description="Turn AI output into branded lead magnets, ebooks, and proposals in one click. AI IS YOUR UNFAIR ADVANTAGE."
        icon={FileText}
        features={[
          { icon: Sparkles, title: "AI Drafting", desc: "Generate full PDFs from a single prompt." },
          { icon: Palette, title: "Brand Themes", desc: "Apply your colors, logo, and fonts globally." },
          { icon: FileText, title: "Templates", desc: "Lead magnets, ebooks, proposals, reports." },
          { icon: Download, title: "1-Click Export", desc: "High-res PDF, ready to ship anywhere." },
        ]}
      />
    </DashboardLayout>
  ),
});
