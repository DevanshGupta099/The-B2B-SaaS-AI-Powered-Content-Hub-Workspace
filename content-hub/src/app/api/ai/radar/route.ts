import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const competitor = (body.competitor || "").trim();
    const eventTitle = (body.eventTitle || body.featureArea || body.title || "").trim();
    const details = (body.details || body.ourAdvantage || "").trim();

    if (!competitor || !eventTitle) {
      return NextResponse.json({ error: "Competitor and event title or feature area are required" }, { status: 400 });
    }

    const systemPrompt = `You are the Nexus Competitive Market Intelligence Officer.
Analyze competitor launches, feature shifts, pricing changes, or content campaigns.
Formulate a decisive counter-positioning strategy for our enterprise B2B Content Operating System.

Return strictly valid JSON with no markdown tags:
{
  "impactAnalysis": "2-sentence executive summary of the competitive threat level and market implication",
  "counterAngles": [
    {
      "channel": "LinkedIn & Social",
      "headline": "Provocative, differentiated hook positioning our strengths against their weakness",
      "rationale": "Why this narrative wins the market conversation"
    },
    {
      "channel": "Sales Battlecard",
      "headline": "Objection handling talking point for AEs facing this competitor in RFP calls",
      "rationale": "Key feature or governance moat they lack"
    },
    {
      "channel": "Search / SEO",
      "headline": "Target comparison or alternative keyword landing page concept",
      "rationale": "High-intent capture strategy"
    }
  ],
  "recommendedAction": "Single immediate high-leverage initiative to execute this week"
}`;

    const userPrompt = `Competitor: ${competitor}\nEvent / Move: ${eventTitle}\nDetails: ${details || "Competitor announced new AI content features with generic consumer LLMs."}`;

    const completion = await generateChatCompletion({
      messages: [{ role: "user", content: userPrompt }],
      systemPrompt,
      temperature: 0.5,
      maxTokens: 400,
    });

    let result;
    try {
      const clean = completion.text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
      result = JSON.parse(clean);
    } catch {
      result = {
        impactAnalysis: `${competitor}'s latest initiative aims to capture mid-market accounts, but lacks enterprise-grade deterministic brand voice linters and CRDT document collaboration.`,
        counterAngles: [
          {
            channel: "LinkedIn & Social",
            headline: "Why generic generative AI tools cause brand drift—and how deterministic governance fixes it.",
            rationale: "Shifts conversation from feature vanity to compliance safety."
          },
          {
            channel: "Sales Battlecard",
            headline: "Highlight zero data retention and locked brand kit guardrails that enterprise legal requires.",
            rationale: "Disqualifies their unvetted model usage."
          }
        ],
        recommendedAction: "Publish a targeted comparison article emphasizing compliance and 1-to-many multichannel atomization."
      };
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Radar API Error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze competitor move";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
