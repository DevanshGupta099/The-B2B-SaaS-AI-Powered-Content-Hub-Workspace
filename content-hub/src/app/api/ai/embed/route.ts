import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required to generate embeddings" }, { status: 400 });
    }

    const result = await generateEmbedding(text);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Embedding API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate embedding" }, { status: 500 });
  }
}
