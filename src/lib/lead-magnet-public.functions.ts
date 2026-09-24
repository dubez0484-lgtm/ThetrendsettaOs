import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const getLmCampaignBySlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data }) => {
    const supabasePublic = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data: campaign, error } = await supabasePublic
      .from("lm_campaigns")
      .select("id, slug, headline, subheadline, cta_label, fields, require_email_confirm, document_id")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();

    if (error || !campaign) return null;

    let doc: { title: string; type: string; pdf_url: string | null } | null = null;
    if (campaign.document_id) {
      const { data: d } = await supabasePublic
        .from("lm_documents")
        .select("title, type, pdf_url")
        .eq("id", campaign.document_id)
        .eq("status", "published")
        .maybeSingle();
      doc = d ?? null;
    }

    return { campaign, doc };
  });
