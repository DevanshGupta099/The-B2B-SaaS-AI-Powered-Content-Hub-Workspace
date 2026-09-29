import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { emailService } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const user = await serverStore.findUserByEmailAsync(normalized);

    if (!user) {
      // Return success anyway to avoid user enumeration
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset link has been dispatched."
      });
    }

    const resetToken = `tok_${Math.random().toString(36).substring(2)}${Date.now()}`;
    const result = await emailService.sendPasswordResetEmail(normalized, resetToken);

    return NextResponse.json({
      success: true,
      message: "Reset link has been dispatched.",
      delivery: result.simulated ? "simulated" : "delivered"
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to initiate password reset";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
