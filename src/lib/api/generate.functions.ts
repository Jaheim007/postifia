import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DAILY_LIMIT = 10;

const PlatformKeys = [
  "facebook","twitter","instagram_caption","instagram_carousel","linkedin",
  "tiktok","discord","snapchat","telegram","whatsapp","hashtags","image_prompt","cta",
] as const;

const InputSchema = z.object({
  topic: z.string().min(3).max(2000),
  tone: z.string().min(1).max(40),
  language: z.enum(["fr", "en"]),
});

function buildPrompt(topic: string, tone: string, language: "fr" | "en") {
  const langName = language === "fr" ? "français" : "English";
  return `Tu es POSTIFY AI, expert mondial du contenu social. À partir de l'idée suivante, génère du contenu OPTIMISÉ et NATIF pour chaque plateforme, dans la langue : ${langName}. Ton souhaité : ${tone}.

IDÉE / SUJET : """${topic}"""

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans backticks) avec EXACTEMENT ces clés :
{
  "facebook": "Post Facebook engageant (3-6 lignes, émojis pertinents, accroche forte, 1 question d'engagement à la fin)",
  "twitter": "Thread X/Twitter de 5 à 8 tweets numérotés (1/ 2/ 3/...), chaque tweet ≤ 270 caractères, séparés par des doubles sauts de ligne",
  "instagram_caption": "Caption Instagram (accroche puissante première ligne, 4-6 paragraphes courts, émojis, CTA)",
  "instagram_carousel": "Carrousel Instagram de 6 slides au format 'Slide 1: TITRE\\nContenu...\\n\\nSlide 2: ...' (max 8 slides)",
  "linkedin": "Post LinkedIn professionnel (hook, structure aérée, storytelling, valeur concrète, CTA, sans hashtags inline)",
  "tiktok": "Script vidéo TikTok/Reels (Hook 0-3s / Corps / CTA), formaté avec timestamps et indications visuelles",
  "discord": "Message communautaire Discord chaleureux avec markdown Discord (**, __, > )",
  "snapchat": "Texte court Snapchat (1-2 phrases ultra punchy avec émojis)",
  "telegram": "Post Telegram structuré avec markdown léger et émojis, 4-8 lignes",
  "whatsapp": "Version WhatsApp courte et partageable (≤ 350 caractères, émojis, ton conversationnel)",
  "hashtags": "20 hashtags pertinents séparés par des espaces, mix de hashtags larges et de niche",
  "image_prompt": "Prompt détaillé en ANGLAIS pour Midjourney/DALL·E (style, sujet, lumière, composition, ambiance, mots-clés techniques)",
  "cta": "Un call-to-action puissant et actionnable, en une phrase"
}

Règles strictes :
- Le JSON doit être PARFAITEMENT valide et parseable.
- Aucun texte avant ou après le JSON.
- Pas de markdown autour du JSON.
- Tous les contenus dans la langue : ${langName} (sauf image_prompt qui est toujours en anglais).
- Respecte le ton "${tone}".`;
}

export const generateContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Reset daily counter if needed + check limit
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("credits_used_today, last_reset_date")
      .eq("id", userId)
      .maybeSingle();
    if (profErr) throw new Error(profErr.message);

    const today = new Date().toISOString().slice(0, 10);
    let used = profile?.credits_used_today ?? 0;
    if (!profile || profile.last_reset_date !== today) {
      used = 0;
      await supabase.from("profiles").upsert({
        id: userId,
        credits_used_today: 0,
        last_reset_date: today,
      });
    }
    if (used >= DAILY_LIMIT) {
      throw new Error(`Limite quotidienne atteinte (${DAILY_LIMIT}/jour). Revenez demain ou passez au plan Pro.`);
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY manquante.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Tu génères uniquement du JSON strictement valide, sans markdown." },
          { role: "user", content: buildPrompt(data.topic, data.tone, data.language) },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Trop de requêtes. Réessayez dans un instant.");
    if (res.status === 402) throw new Error("Crédits IA épuisés. Rechargez votre workspace.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Erreur IA: ${res.status} ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const raw = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Record<string, string>;
    try {
      parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      const m = String(raw).match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : {};
    }

    const content: Record<string, string> = {};
    for (const k of PlatformKeys) content[k] = String(parsed[k] ?? "");

    // Save generation + increment counter
    await supabase.from("generations").insert({
      user_id: userId,
      topic: data.topic,
      tone: data.tone,
      language: data.language,
      content,
    });

    const newUsed = used + 1;
    await supabase.from("profiles").update({
      credits_used_today: newUsed,
      last_reset_date: today,
    }).eq("id", userId);

    return { content, creditsUsed: newUsed, creditsLimit: DAILY_LIMIT };
  });

export const getUsage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("profiles")
      .select("credits_used_today, last_reset_date")
      .eq("id", userId)
      .maybeSingle();
    const today = new Date().toISOString().slice(0, 10);
    const used = data && data.last_reset_date === today ? data.credits_used_today : 0;
    return { used, limit: DAILY_LIMIT };
  });
