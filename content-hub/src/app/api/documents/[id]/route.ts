import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const document = serverStore.getDocumentById(id);

    if (!document) {
      return NextResponse.json({ error: `Document or workspace '${id}' not found` }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await req.json();

    const updated = serverStore.updateDocument(id, body);
    if (!updated) {
      return NextResponse.json({ error: `Document '${id}' not found` }, { status: 404 });
    }

    return NextResponse.json({ document: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
