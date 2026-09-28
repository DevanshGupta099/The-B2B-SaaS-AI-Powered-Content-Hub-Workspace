import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding, calculateCosineSimilarity } from "@/lib/ai-service";

export interface SearchableItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  embedding?: number[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || "").trim();
    const rawItems = body.items || body.documents;

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json({ error: "Items or documents array is required for semantic matching" }, { status: 400 });
    }

    const items: SearchableItem[] = rawItems;

    // 1. Generate query embedding
    const queryEmbResult = await generateEmbedding(query);
    const queryVector = queryEmbResult.embedding;

    // 2. Score each item
    const scored = await Promise.all(
      items.map(async (item: SearchableItem) => {
        let itemVector = item.embedding;
        if (!itemVector || itemVector.length !== queryVector.length) {
          try {
            const textToEmbed = `${item.title}: ${item.content}`.slice(0, 800);
            const res = await generateEmbedding(textToEmbed);
            itemVector = res.embedding;
          } catch {
            itemVector = [];
          }
        }

        const similarity = itemVector.length > 0 
          ? calculateCosineSimilarity(queryVector, itemVector) 
          : 0;

        return {
          id: item.id,
          title: item.title,
          content: item.content,
          category: item.category,
          similarity: Math.round(similarity * 1000) / 10, // e.g. 84.5%
        };
      })
    );

    // Sort descending by similarity
    scored.sort((a, b) => b.similarity - a.similarity);

    return NextResponse.json({
      query,
      results: scored,
      model: queryEmbResult.model,
      dimensions: queryEmbResult.dimensions,
    });
  } catch (error: any) {
    console.error("Semantic Search API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute semantic search" }, { status: 500 });
  }
}
