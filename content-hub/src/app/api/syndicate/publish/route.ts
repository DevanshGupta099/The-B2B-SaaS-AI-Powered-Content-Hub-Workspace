import { NextRequest, NextResponse } from "next/server";
import { syndicationEngine, SyndicationChannel } from "@/lib/syndication";
import { serverStore } from "@/lib/server-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      documentId = "doc-1", 
      title = "Governed Whitepaper", 
      content = "Synthesized whitepaper content.", 
      channels = ["linkedin", "webflow"],
      utmSource = "nexus_workspace",
      utmCampaign = "q4_demand_gen"
    } = body;

    const validatedChannels: SyndicationChannel[] = channels.filter(
      (c: string): c is SyndicationChannel => ["webflow", "hubspot", "wordpress", "linkedin"].includes(c)
    );

    if (validatedChannels.length === 0) {
      return NextResponse.json({ error: "At least one valid syndication channel is required" }, { status: 400 });
    }

    const results = await syndicationEngine.dispatchAll({
      documentId,
      title,
      content,
      channels: validatedChannels,
      utmSource,
      utmCampaign
    });

    // Log to audit activity
    const profile = serverStore.getProfile();
    serverStore.addActivity({
      user: profile.name,
      action: `syndicated "${title}" across ${validatedChannels.join(", ")}`,
      document: title,
      avatar: profile.avatarUrl
    });

    return NextResponse.json({
      success: true,
      message: `Syndicated to ${results.length} channel(s)`,
      results
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to syndicate document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
