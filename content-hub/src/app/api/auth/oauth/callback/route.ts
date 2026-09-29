import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

/**
 * OAuth Callback Handler
 * Receives code from Google / GitHub, exchanges for user info, upserts into Neon DB, and sets session.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const provider = url.searchParams.get("provider");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
  }

  if (!code || !provider) {
    return NextResponse.redirect(new URL("/login?error=Invalid+OAuth+callback", req.url));
  }

  try {
    let email = "";
    let name = "";

    if (provider === "google") {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = `${url.origin}/api/auth/oauth/callback?provider=google`;

      if (clientId && clientSecret) {
        // Exchange code for token
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code"
          })
        });

        const tokens = await tokenRes.json();
        if (tokens.access_token) {
          const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
          });
          const profile = await userRes.json();
          email = profile.email;
          name = profile.name || email.split("@")[0];
        }
      }
    } else if (provider === "github") {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      if (clientId && clientSecret) {
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code
          })
        });

        const tokenData = await tokenRes.json();
        if (tokenData.access_token) {
          const userRes = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "User-Agent": "Nexus-Content-Hub"
            }
          });
          const profile = await userRes.json();
          name = profile.name || profile.login;
          email = profile.email;

          if (!email) {
            const emailsRes = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "User-Agent": "Nexus-Content-Hub"
              }
            });
            const emails = await emailsRes.json();
            const primary = emails.find((e: { primary: boolean }) => e.primary);
            email = primary ? primary.email : `${profile.login}@github.nexus.local`;
          }
        }
      }
    }

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=Failed+to+retrieve+email", req.url));
    }

    // Upsert user in Neon DB & memory
    const existing = await serverStore.findUserByEmailAsync(email);
    const user = existing || (await serverStore.createUserAsync({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      password: `oauth_${Date.now()}`,
      role: "Editor",
      workspaceName: "Project Apollo"
    }));

    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    res.cookies.set("nexus_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OAuth verification failed";
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, req.url));
  }
}
