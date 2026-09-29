export interface CollaboratorPeer {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  color: string;
  cursor?: { x: number; y: number };
  activeDocumentId?: string;
  lastActive: number;
}

const PEER_COLORS = [
  "#4f46e5", // Indigo
  "#7c3aed", // Violet
  "#2563eb", // Blue
  "#0891b2", // Cyan
  "#d97706", // Amber
  "#db2777"  // Pink
];

// In-memory Room State Registry for Realtime Signaling
const roomPeersMap = new Map<string, Map<string, CollaboratorPeer>>();

export const realtimeEngine = {
  join(roomId: string, peer: Omit<CollaboratorPeer, "color" | "lastActive">): CollaboratorPeer {
    let room = roomPeersMap.get(roomId);
    if (!room) {
      room = new Map<string, CollaboratorPeer>();
      roomPeersMap.set(roomId, room);
    }

    const existing = room.get(peer.id);
    const color = existing?.color || PEER_COLORS[room.size % PEER_COLORS.length];

    const updatedPeer: CollaboratorPeer = {
      ...peer,
      color,
      cursor: peer.cursor || existing?.cursor || { x: 0, y: 0 },
      lastActive: Date.now()
    };

    room.set(peer.id, updatedPeer);
    return updatedPeer;
  },

  updateCursor(roomId: string, peerId: string, x: number, y: number): void {
    const room = roomPeersMap.get(roomId);
    if (room && room.has(peerId)) {
      const peer = room.get(peerId)!;
      peer.cursor = { x, y };
      peer.lastActive = Date.now();
    }
  },

  leave(roomId: string, peerId: string): void {
    const room = roomPeersMap.get(roomId);
    if (room) {
      room.delete(peerId);
      if (room.size === 0) roomPeersMap.delete(roomId);
    }
  },

  getPeers(roomId: string): CollaboratorPeer[] {
    const room = roomPeersMap.get(roomId);
    if (!room) {
      // Return default initial seeded presence if room is new
      return [
        {
          id: "sarah",
          name: "Sarah Connor",
          role: "Admin",
          avatarUrl: `https://api.dicebear.com/7.x/lorelei/svg?seed=sarah&backgroundColor=b6e3f4,c0aede`,
          color: "#4f46e5",
          cursor: { x: 140, y: 220 },
          lastActive: Date.now()
        },
        {
          id: "devansh",
          name: "Devansh",
          role: "Admin",
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=devansh&backgroundColor=d1d4f9,ffdfbf`,
          color: "#7c3aed",
          cursor: { x: 380, y: 310 },
          lastActive: Date.now()
        }
      ];
    }

    // Prune stale peers (> 45s of inactivity)
    const now = Date.now();
    const active: CollaboratorPeer[] = [];
    for (const [id, peer] of room.entries()) {
      if (now - peer.lastActive < 45000) {
        active.push(peer);
      } else {
        room.delete(id);
      }
    }

    return active;
  }
};
