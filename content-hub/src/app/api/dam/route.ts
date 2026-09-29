import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { generateChatCompletion } from "@/lib/ai-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || undefined;
    const query = searchParams.get("query")?.toLowerCase() || undefined;

    let assets = serverStore.getMediaAssets(folder);
    if (query) {
      assets = assets.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query)) ||
        a.aiAutoTags.some(t => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({ assets, total: assets.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch DAM assets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, folder, type, size, previewUrl, prompt, dimensions, tags } = body;

    let aiAutoTags: string[] = ["enterprise asset", "verified"];

    // If a prompt or name is provided, generate rich AI auto-tags
    if (prompt || name) {
      try {
        const tagResponse = await generateChatCompletion({
          messages: [
            {
              role: "user",
              content: `Generate 4 concise comma-separated visual tags (no hashtags, lowercase) for this digital media asset description: "${prompt || name}". Output ONLY comma-separated tags.`
            }
          ],
          temperature: 0.2,
          maxTokens: 50
        });
        const parsedTags = tagResponse.text.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
        if (parsedTags.length > 0) {
          aiAutoTags = parsedTags;
        }
      } catch {
        // Fallback default tags
        aiAutoTags = ["visual asset", "cloud media", "high fidelity", "auto-indexed"];
      }
    }

    let finalPreviewUrl = previewUrl || "/nexus-hero-3d.jpg";
    if (prompt && (!previewUrl || previewUrl === "/nexus-hero-3d.jpg")) {
      const cleanPrompt = encodeURIComponent(prompt.trim());
      const seed = Date.now();
      finalPreviewUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1280&height=720&nologo=true&seed=${seed}`;
    }

    const created = serverStore.addMediaAsset({
      name: name || `ai-${Date.now()}.${type === "svg" ? "svg" : "jpg"}`,
      folder: folder || "Hero Graphics",
      type: type || "image",
      size: size || "2.1 MB",
      tags: Array.isArray(tags) && tags.length > 0 ? tags : ["AI Media", "DAM Sync"],
      dimensions: dimensions || "1920 x 1080",
      previewUrl: finalPreviewUrl,
      aiAutoTags
    });

    return NextResponse.json({ asset: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create DAM asset";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
    }

    const deleted = serverStore.deleteMediaAsset(id);
    return NextResponse.json({ success: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete DAM asset";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
