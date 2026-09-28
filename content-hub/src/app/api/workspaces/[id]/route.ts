import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const workspace = serverStore.getWorkspaceById(id);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const documents = serverStore.getDocuments(workspace.id);
    return NextResponse.json({ workspace, documents });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch workspace";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
