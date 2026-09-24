import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { GitBranch, TrendingDown, Zap, Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/preview-pipeline")({
  head: () => ({ meta: [{ title: "Preview Pipeline — TRENDSETTA SYSTEM™" }] }),
  component: () => (
    <DashboardLayout>
      <ComingSoon
        eyebrow="In development"
        title="Step-by-Step Preview Pipeline"
        description="Visualize the full journey — Traffic → Landing → Lead Magnet → Email → Offer → Checkout — with live neon flow lines."
        icon={GitBranch}
        features={[
          { icon: Eye, title: "Animated Flow", desc: "Glowing neon connections between every step." },
          { icon: TrendingDown, title: "Drop-Off Detection", desc: "Spot bottlenecks before they cost you sales." },
          { icon: Zap, title: "Conversion %", desc: "Real-time rates at each stage of the funnel." },
          { icon: GitBranch, title: "Bottleneck Alerts", desc: "AI flags weak links automatically." },
        ]}
      />
    </DashboardLayout>
  ),
});
