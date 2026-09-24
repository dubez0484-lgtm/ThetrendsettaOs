import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { Zap, MessageCircle, Mail, Workflow } from "lucide-react";

export const Route = createFileRoute("/_authenticated/automation")({
  head: () => ({ meta: [{ title: "Automation — TRENDSETTA SYSTEM™" }] }),
  component: () => (
    <DashboardLayout>
      <ComingSoon
        eyebrow="Workflow engine"
        title="Automation Center"
        description="Node-based visual workflows. Triggers, conditions, actions — WhatsApp, email, funnel, and AI all in one canvas."
        icon={Zap}
        features={[
          { icon: Workflow, title: "Visual Builder", desc: "Drag nodes, connect logic, ship workflows." },
          { icon: MessageCircle, title: "WhatsApp Automation", desc: "Auto-reply, broadcast, route conversations." },
          { icon: Mail, title: "Email Sequences", desc: "Drip campaigns triggered by funnel events." },
          { icon: Zap, title: "AI Actions", desc: "Embed AI generation as a node in any flow." },
        ]}
      />
    </DashboardLayout>
  ),
});
