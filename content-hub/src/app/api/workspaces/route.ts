import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { getAvatarUrl } from "@/lib/avatar";

export async function GET() {
  try {
    const workspaces = serverStore.getWorkspaces();
    return NextResponse.json({ workspaces });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch workspaces";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, desc, color, tags } = body;
    if (!name?.trim()) {
      return NextResponse.json({ error: "Workspace name is required" }, { status: 400 });
    }

    const created = serverStore.addWorkspace({
      name: name.trim(),
      desc: desc?.trim() || "Collaborative intelligent workspace",
      docsCount: 0,
      membersCount: 1,
      color: color || "bg-indigo-600",
      users: [{ id: "u2", name: "Devansh", avatarUrl: getAvatarUrl("Devansh", "bottts") }],
      tags: Array.isArray(tags) ? tags : ["General"]
    });

    return NextResponse.json({ workspace: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create workspace";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
