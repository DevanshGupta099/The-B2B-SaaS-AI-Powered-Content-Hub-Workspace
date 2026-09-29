import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

/**
 * OAuth Provider Initiation Route
 * Handles Google & GitHub Single Sign-On
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(req.url);
  const redirectUri = `${url.origin}/api/auth/oauth/callback?provider=${provider}`;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=openid%20email%20profile&access_type=offline`;
      return NextResponse.redirect(authUrl);
    }
    // Instant Dev/Demo mode Single Sign-On for Google
    const demoUser = await serverStore.findUserByEmailAsync("devanshgupta091@gmail.com");
    const userToLogin = demoUser || (await serverStore.createUserAsync({
      name: "Devansh Gupta (Google)",
      email: "devanshgupta091@gmail.com",
      password: "password123",
      role: "Owner",
      workspaceName: "Project Apollo"
    }));

    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    res.cookies.set("nexus_session", userToLogin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  }

  if (provider === "github") {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (clientId) {
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=user:email`;
      return NextResponse.redirect(authUrl);
    }
    // Instant Dev/Demo mode Single Sign-On for GitHub
    const demoUser = await serverStore.findUserByEmailAsync("sarah@nexus.ai");
    const userToLogin = demoUser || (await serverStore.createUserAsync({
      name: "Sarah Connor (GitHub)",
      email: "sarah@nexus.ai",
      password: "password123",
      role: "Editor",
      workspaceName: "Project Apollo"
    }));

    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    res.cookies.set("nexus_session", userToLogin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  }

  return NextResponse.json({ error: "Unsupported OAuth provider" }, { status: 400 });
}
