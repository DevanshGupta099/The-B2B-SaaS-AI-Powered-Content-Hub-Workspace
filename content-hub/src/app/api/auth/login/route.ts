import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const result = await serverStore.validateCredentialsAsync(email, password);

    if (!result.valid || !result.user) {
      return NextResponse.json(
        { error: result.reason || "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set secure authentication cookie
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: result.user
    });

    response.cookies.set("nexus_session", result.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to authenticate";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
