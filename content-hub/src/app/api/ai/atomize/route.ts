import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sourceContent = (body.sourceContent || body.content || body.brief || "").trim();
    const tone = body.tone || "Authoritative and data-driven";
    const brandKit = body.brandKit;

    if (!sourceContent) {
      return NextResponse.json({ error: "Source content is required for atomization" }, { status: 400 });
    }

    const systemPrompt = `You are the Nexus Omnichannel Content Atomizer.
Your mission is to take 1 core source document or brief and transform it into 6 distinct, ready-to-publish B2B SaaS channel assets.

Return your response strictly as valid, well-formed JSON with the following structure:
{
  "summary": "Brief 1-sentence overview of the atomized campaign",
  "outputs": {
    "linkedin": "Full high-converting LinkedIn post with strong opening hook, whitespace, bullet proof points, and #hashtags",
    "twitter": "5-part narrative X thread formatted as 1/5, 2/5, 3/5, 4/5, 5/5 with viral hooks",
    "email": "Subject line, preview text, and full email body formatted cleanly with [CTA button]",
    "video": "60-second video / YouTube shorts script with [VISUAL] scene cues and spoken narration",
    "seo": "Optimized Page Title, 155-character Meta Description, and 3 memorable pull quotes",
    "memo": "Executive TL;DR internal memo for leadership with Problem, Solution, and Next Actions"
  }
}
${brandKit?.voice ? `Brand Voice: ${brandKit.voice}` : ""}
${brandKit?.restrictedTerms ? `Forbidden terms: ${brandKit.restrictedTerms}` : ""}
Target Tone: ${tone}
DO NOT wrap your JSON in markdown code blocks if possible, or use standard JSON.`;

    const userPrompt = `Here is the source content to atomize into 6 channels:\n\n${sourceContent}`;

    const completion = await generateChatCompletion({
      messages: [{ role: "user", content: userPrompt }],
      systemPrompt,
      temperature: 0.6,
      maxTokens: 800,
    });

    let parsedResult;
    try {
      const cleaned = completion.text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      parsedResult = JSON.parse(cleaned);
    } catch {
      // Fallback structured object if model added conversational wrapper
      parsedResult = {
        summary: "Atomized Omnichannel Multi-Asset Campaign",
        outputs: {
          linkedin: completion.text.slice(0, 800),
          twitter: "1/5 " + completion.text.slice(0, 300) + "\n\n2/5 ...",
          email: "Subject: Important Update\n\n" + completion.text.slice(0, 500),
          video: "[VISUAL: Screen share]\n" + completion.text.slice(0, 400),
          seo: "Meta Description: " + completion.text.slice(0, 155),
          memo: "Internal Executive Memo: " + completion.text.slice(0, 400),
        }
      };
    }

    return NextResponse.json({
      success: true,
      data: parsedResult,
      meta: {
        latencyMs: completion.latencyMs,
        tokens: completion.tokens,
        model: completion.model,
      }
    });
  } catch (error: any) {
    console.error("Atomize API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to atomize content" }, { status: 500 });
  }
}
