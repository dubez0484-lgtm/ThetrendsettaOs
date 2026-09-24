import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const slugify = (name: string, fallback: string) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || fallback}-${Math.random().toString(36).slice(2, 7)}`;

/* ---------------------------------- docs --------------------------------- */

export const listLmDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("lm_documents")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createLmDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        title: z.string().min(1).max(120),
        type: z.string().min(1).max(40).default("ebook"),
        content: z.record(z.string(), z.any()).default({}),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("lm_documents")
      .insert({
        user_id: context.userId,
        title: data.title,
        slug: slugify(data.title, "lead-magnet"),
        type: data.type,
        content: data.content,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateLmDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        title: z.string().min(1).max(120).optional(),
        type: z.string().min(1).max(40).optional(),
        content: z.record(z.string(), z.any()).optional(),
        theme: z.record(z.string(), z.any()).optional(),
        status: z.enum(["draft", "published"]).optional(),
        pdf_url: z.string().url().nullable().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("lm_documents").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLmDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("lm_documents").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* -------------------------------- campaigns ------------------------------- */

export const listLmCampaigns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("lm_campaigns")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createLmCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        name: z.string().min(1).max(120),
        document_id: z.string().uuid().nullable().default(null),
        headline: z.string().min(1).max(200).default("Get the free guide"),
        subheadline: z.string().max(400).optional(),
        cta_label: z.string().min(1).max(60).default("Download now"),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("lm_campaigns")
      .insert({
        user_id: context.userId,
        name: data.name,
        slug: slugify(data.name, "campaign"),
        document_id: data.document_id,
        headline: data.headline,
        subheadline: data.subheadline ?? null,
        cta_label: data.cta_label,
        fields: [{ key: "email", label: "Email", required: true }],
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateLmCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().min(1).max(120).optional(),
        document_id: z.string().uuid().nullable().optional(),
        headline: z.string().min(1).max(200).optional(),
        subheadline: z.string().max(400).nullable().optional(),
        cta_label: z.string().min(1).max(60).optional(),
        fields: z.array(z.any()).optional(),
        require_email_confirm: z.boolean().optional(),
        active: z.boolean().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("lm_campaigns").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLmCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("lm_campaigns").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------------------------- leads --------------------------------- */

export const listLmLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("lm_leads")
      .select("*, lm_campaigns(name)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteLmLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("lm_leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
