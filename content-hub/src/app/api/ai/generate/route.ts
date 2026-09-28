import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion, LLMMessage } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      prompt, 
      messages, 
      systemPrompt = "", 
      temperature = 0.7, 
      maxTokens = 2000, 
      model, 
      provider,
      brandVoice,
      restrictedTerms 
    } = body;

    let finalSystemPrompt = systemPrompt || "You are Nexus AI, an elite B2B SaaS Content Architect and Enterprise Copywriter. You write authoritative, clear, high-converting, and actionable content. Avoid fluff, hyperbolic buzzwords, and clichés.";

    if (brandVoice || restrictedTerms) {
      finalSystemPrompt += `\n\n[MANDATORY BRAND GOVERNANCE RULES]`;
      if (brandVoice) {
        finalSystemPrompt += `\n- Brand Tone & Voice: ${brandVoice}`;
      }
      if (restrictedTerms) {
        finalSystemPrompt += `\n- FORBIDDEN BUZZWORDS (DO NOT USE THESE UNDER ANY CIRCUMSTANCES): ${restrictedTerms}`;
      }
      finalSystemPrompt += `\n- Format cleanly with Markdown headings, bullet points, and bold emphasis where appropriate.`;
    }

    const chatMessages: LLMMessage[] = [];
    if (messages && Array.isArray(messages)) {
      chatMessages.push(...messages);
    } else if (prompt) {
      chatMessages.push({ role: "user", content: prompt });
    } else {
      return NextResponse.json({ error: "Missing prompt or messages array" }, { status: 400 });
    }

    const response = await generateChatCompletion({
      messages: chatMessages,
      systemPrompt: finalSystemPrompt,
      temperature,
      maxTokens,
      model,
      provider,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("AI Generation Route Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate AI completion",
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
