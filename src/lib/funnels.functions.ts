import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "funnel";

export const listFunnels = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("funnels")
      .select("id, name, slug, type, published, updated_at, created_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getFunnel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("funnels")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const createFunnel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      name: z.string().min(1).max(80),
      type: z.string().min(1).max(40).default("lead"),
      sections: z.array(z.any()).default([]),
    }).parse(i)
  )
  .handler(async ({ data, context }) => {
    const base = slugify(data.name);
    const slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
    const { data: row, error } = await context.supabase
      .from("funnels")
      .insert({
        user_id: context.userId,
        name: data.name,
        slug,
        type: data.type,
        sections: data.sections,
      })
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateFunnel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(80).optional(),
      type: z.string().min(1).max(40).optional(),
      sections: z.array(z.any()).optional(),
      seo: z.object({ title: z.string().max(120).optional(), description: z.string().max(300).optional() }).optional(),
      theme: z.record(z.string(), z.any()).optional(),
      published: z.boolean().optional(),
    }).parse(i)
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("funnels").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteFunnel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("funnels").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateFunnel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: src, error: e1 } = await context.supabase.from("funnels").select("*").eq("id", data.id).single();
    if (e1 || !src) throw new Error(e1?.message ?? "Not found");
    const slug = `${slugify(src.name)}-${Math.random().toString(36).slice(2, 7)}`;
    const { data: row, error } = await context.supabase
      .from("funnels")
      .insert({
        user_id: context.userId,
        name: `${src.name} (Copy)`,
        slug,
        type: src.type,
        sections: src.sections,
        seo: src.seo,
        theme: src.theme,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const generateFunnelWithAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      prompt: z.string().min(4).max(500),
      type: z.string().max(40).default("lead"),
    }).parse(i)
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const { text } = await generateText({
      model,
      system: `You generate funnel content as STRICT JSON. Output ONLY a JSON object with this exact shape:
{
  "name": string,
  "hero": { "eyebrow": string, "headline": string, "sub": string, "ctaText": string },
  "features": { "title": string, "items": [{ "title": string, "desc": string }] },
  "testimonials": { "title": string, "items": [{ "name": string, "role": string, "quote": string }] },
  "pricing": { "title": string, "items": [{ "name": string, "price": string, "period": string, "features": [string], "cta": string }] },
  "faq": { "title": string, "items": [{ "q": string, "a": string }] },
  "cta": { "headline": string, "sub": string, "ctaText": string },
  "seo": { "title": string, "description": string }
}
No markdown, no commentary — JSON only.`,
      prompt: `Business / offer: ${data.prompt}\nFunnel type: ${data.type}\nWrite punchy, high-converting copy.`,
    });

    const clean = text.replace(/^```json\s*|^```\s*|```$/g, "").trim();
    let parsed: any;
    try { parsed = JSON.parse(clean); } catch { throw new Error("AI returned invalid JSON"); }
    return parsed;
  });

// Analytics
export const getFunnelAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString();
    const { data: rows, error } = await context.supabase
      .from("funnel_events")
      .select("event_type, created_at")
      .eq("funnel_id", data.id)
      .gte("created_at", since)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const totals = { view: 0, optin: 0, click: 0, conversion: 0 };
    const byDay = new Map<string, { day: string; views: number; optins: number; clicks: number }>();
    for (const r of rows ?? []) {
      totals[r.event_type as keyof typeof totals]++;
      const day = (r.created_at as string).slice(0, 10);
      const b = byDay.get(day) ?? { day, views: 0, optins: 0, clicks: 0 };
      if (r.event_type === "view") b.views++;
      if (r.event_type === "optin") b.optins++;
      if (r.event_type === "click") b.clicks++;
      byDay.set(day, b);
    }
    return {
      totals,
      ctr: totals.view ? Math.round((totals.click / totals.view) * 1000) / 10 : 0,
      conversionRate: totals.view ? Math.round((totals.optin / totals.view) * 1000) / 10 : 0,
      series: Array.from(byDay.values()),
    };
  });

// Public fetch (no auth) — relies on RLS policy "select published public"
export const getPublishedBySlug = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ slug: z.string().min(1).max(80) }).parse(i))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(
      process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "",
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
    );
    const { data: row, error } = await client
      .from("funnels")
      .select("id, name, slug, sections, seo, published")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
