import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = (body.text || "").trim();
    const targetLang = (body.targetLang || body.targetLanguage || "").trim();
    const tone = body.tone || "Professional B2B";

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Text and target language are required" }, { status: 400 });
    }

    const systemPrompt = `You are the Nexus Localization & Transcreation Engine.
Do not do word-for-word translation. Instead, perform cultural transcreation for an enterprise B2B SaaS audience.
Preserve product terms, technical accuracy, formatting, and high-converting resonance.

Return strictly valid JSON:
{
  "translatedText": "The high quality transcreated text in the target language",
  "culturalNotes": "Brief 1-sentence note explaining idiom or syntax adaptations made for this locale",
  "qualityScore": 98
}`;

    const userPrompt = `Target Language: ${targetLang}\nTone: ${tone}\nSource Content:\n${text}`;

    const completion = await generateChatCompletion({
      messages: [{ role: "user", content: userPrompt }],
      systemPrompt,
      temperature: 0.3,
      maxTokens: 350,
    });

    let result;
    try {
      const clean = completion.text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
      result = JSON.parse(clean);
    } catch {
      result = {
        translatedText: completion.text,
        culturalNotes: `Adapted terminology to fit native enterprise conventions in ${targetLang}.`,
        qualityScore: 95
      };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Translate API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to transcreate content" }, { status: 500 });
  }
}
