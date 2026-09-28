import { NextRequest, NextResponse } from "next/server";
import { evaluateBrandVoice, generateChatCompletion } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const { text, restrictedTerms, voiceGuide, autoFix } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required to perform brand voice check" }, { status: 400 });
    }

    const report = evaluateBrandVoice(text, restrictedTerms);

    let fixedText = null;
    if (autoFix && report.infractions.length > 0) {
      const fixPrompt = `Rewrite the following marketing copy so that it strictly follows our brand guidelines and eliminates all forbidden buzzwords without losing impact or clarity.

[BRAND GUIDELINES]
Tone: ${voiceGuide || "Authoritative, direct, data-backed"}
Forbidden Buzzwords to remove: ${restrictedTerms || "best-in-class, revolutionary, seamless, guaranteed, game-changer"}

[ORIGINAL DRAFT]
${text}

Return ONLY the rewritten, polished draft text with zero buzzwords and zero preamble.`;

      const completion = await generateChatCompletion({
        messages: [{ role: "user", content: fixPrompt }],
        temperature: 0.3,
        maxTokens: 250,
      });

      fixedText = completion.text.trim();
    }

    return NextResponse.json({
      report,
      fixedText,
    });
  } catch (error: unknown) {
    console.error("Brand Check Error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze brand voice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
