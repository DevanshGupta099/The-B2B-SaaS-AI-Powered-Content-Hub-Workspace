import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, workspaceName } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid corporate or work email address is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters in length" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await serverStore.findUserByEmailAsync(cleanEmail);

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    const cleanName = (name && typeof name === "string" && name.trim()) 
      ? name.trim() 
      : cleanEmail.split("@")[0];

    const newUser = await serverStore.createUserAsync({
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: "Owner",
      workspaceName: workspaceName || `${cleanName}'s Workspace`
    });

    const response = NextResponse.json({
      success: true,
      message: "Workspace account created successfully",
      user: newUser
    }, { status: 201 });

    const { createSessionToken } = await import("@/lib/auth-crypto");
    const signedToken = createSessionToken(newUser.id);

    response.cookies.set("nexus_session", signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create account";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
