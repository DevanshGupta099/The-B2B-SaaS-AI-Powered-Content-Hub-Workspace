import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    
    const notifications = serverStore.getNotifications(category);
    const unreadCount = notifications.filter(n => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      total: notifications.length
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch notifications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Notification id is required" }, { status: 400 });
    }

    const updated = serverStore.markNotificationRead(id);
    if (!updated) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    const notifications = serverStore.getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      message: `Notification ${id} marked as read.`
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update notification";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "mark_all_read") {
      serverStore.markAllNotificationsRead();
      const notifications = serverStore.getNotifications();
      return NextResponse.json({
        success: true,
        unreadCount: 0,
        notifications,
        message: "All notifications marked as read."
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process notifications action";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    serverStore.clearNotifications();
    return NextResponse.json({
      success: true,
      notifications: [],
      unreadCount: 0,
      message: "Notification center cleared."
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to clear notifications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
