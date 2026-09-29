import { NextRequest, NextResponse } from "next/server";
import { realtimeEngine } from "@/lib/collaboration";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const roomId = url.searchParams.get("roomId") || "default";
  const peers = realtimeEngine.getPeers(roomId);
  return NextResponse.json({ roomId, peers, count: peers.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId = "default", user, cursor } = body;

    if (!user || !user.id) {
      return NextResponse.json({ error: "User identity required" }, { status: 400 });
    }

    const peer = realtimeEngine.join(roomId, {
      id: user.id,
      name: user.name || "Collaborator",
      role: user.role || "Editor",
      avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      cursor
    });

    const activePeers = realtimeEngine.getPeers(roomId);
    return NextResponse.json({ peer, activePeers, count: activePeers.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sync room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
