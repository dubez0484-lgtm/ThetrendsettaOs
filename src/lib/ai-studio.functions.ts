import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const SYSTEM = `You are TRENDSETTA AI — an elite copywriter and content strategist for creators, coaches and online businesses. Write punchy, high-converting, on-trend copy. Use markdown with clear headings, bullet lists, and numbered options where helpful. Never include disclaimers.`;

export const AI_MODELS = {
  gemini: "google/gemini-3-flash-preview",
  "gemini-pro": "google/gemini-2.5-pro",
  openai: "openai/gpt-5",
  "openai-mini": "openai/gpt-5-mini",
  claude: "openai/gpt-5", // Claude not yet on gateway; falls back to GPT-5 as the strongest non-Gemini option
} as const;

const generateInput = z.object({
  prompt: z.string().min(2).max(4000),
  category: z.string().min(1).max(64).default("content"),
  platform: z.string().min(1).max(32).optional(),
  tone: z.string().min(1).max(32).optional(),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  creativity: z.number().min(0).max(1).default(0.7),
  model: z.enum(["gemini", "gemini-pro", "openai", "openai-mini", "claude"]).default("gemini"),
});

export const generateAi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => generateInput.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const lengthHint =
      data.length === "short" ? "Keep it concise (under ~120 words)."
      : data.length === "long" ? "Write a thorough, in-depth response."
      : "Aim for medium length, around 200-350 words.";

    const meta = [
      data.platform && `Platform: ${data.platform}`,
      data.tone && `Tone: ${data.tone}`,
      `Category: ${data.category}`,
      lengthHint,
    ].filter(Boolean).join("\n");

    const gateway = createLovableAiGatewayProvider(key);
    const modelId = AI_MODELS[data.model] ?? AI_MODELS.gemini;
    const model = gateway(modelId);
    const { text } = await generateText({
      model,
      system: SYSTEM,
      temperature: data.creativity,
      prompt: `${meta}\n\nUser request:\n${data.prompt}`,
    });

    // Persist
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("ai_generations")
      .insert({
        user_id: userId,
        prompt: data.prompt,
        response: text,
        category: data.category,
        platform: data.platform ?? null,
        tone: data.tone ?? null,
      })
      .select("id, created_at")
      .single();

    if (error) throw new Error(error.message);
    return { id: row.id, response: text, created_at: row.created_at };
  });

export const listGenerations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("ai_generations")
      .select("id, prompt, response, category, platform, tone, favorite, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), favorite: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("ai_generations")
      .update({ favorite: data.favorite })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("ai_generations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
