import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { CalendarDays, Wand2, Layers, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/content-scheduler")({
  head: () => ({ meta: [{ title: "Content Scheduler — TRENDSETTA SYSTEM™" }] }),
  component: () => (
    <DashboardLayout>
      <ComingSoon
        eyebrow="Coming next"
        title="Content Scheduler"
        description="Plan, queue, and auto-publish across TikTok, Instagram, YouTube, X, and Facebook from a single calendar."
        icon={CalendarDays}
        features={[
          { icon: CalendarDays, title: "Calendar + Queue", desc: "Drag-and-drop scheduling across every platform." },
          { icon: Wand2, title: "AI Captions & Hooks", desc: "Auto-generate viral copy on the fly." },
          { icon: Layers, title: "Multi-Platform", desc: "Native badges & previews per channel." },
          { icon: BarChart3, title: "Inline Analytics", desc: "Mini-stats on every post card." },
        ]}
      />
    </DashboardLayout>
  ),
});
