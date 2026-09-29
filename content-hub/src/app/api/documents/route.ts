import { NextResponse } from "next/server";
import { serverStore, BackendDocument } from "@/lib/server-store";
import { getAvatarUrl } from "@/lib/avatar";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || undefined;
    const query = searchParams.get("query")?.toLowerCase() || undefined;

    let documents = serverStore.getDocuments(workspaceId);
    if (query) {
      documents = documents.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query) ||
        d.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({ documents });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch documents";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, workspace, workspaceId, content, tags } = body;
    if (!title?.trim()) {
      return NextResponse.json({ error: "Document title is required" }, { status: 400 });
    }

    const created = serverStore.addDocument({
      title: title.trim(),
      workspaceId: workspaceId || "marketing",
      workspace: (workspace || "Marketing") as BackendDocument["workspace"],
      author: "Devansh",
      authorAvatar: getAvatarUrl("Devansh", "bottts"),
      content: content || "<p>Start writing, or ask Nexus AI Copilot to draft sections for you.</p>",
      tags: Array.isArray(tags) ? tags : ["General"],
      status: "Draft"
    });

    // Also add to activity
    serverStore.addActivity({
      user: "Devansh",
      action: "created document",
      document: created.title,
      avatar: getAvatarUrl("Devansh", "bottts")
    });

    return NextResponse.json({ document: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
