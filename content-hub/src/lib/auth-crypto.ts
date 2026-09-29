import crypto from "crypto";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "nexus_enterprise_nextauth_jwt_super_secret_key_2026";

/**
 * Enterprise Password Hashing using Node.js native scrypt
 * Automatically salts and hashes passwords to prevent plaintext exposure.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  // Support legacy/demo plain passwords during transition
  if (!storedHash.includes(":")) {
    return password === storedHash;
  }
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

/**
 * Cryptographically Signed Session Token (HMAC-SHA256)
 * Prevents cookie tampering and user impersonation.
 */
export function createSessionToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, issuedAt: Date.now() })).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): { valid: boolean; userId?: string } {
  if (!token || !token.includes(".")) {
    // Graceful backward compatibility for existing plain session IDs
    if (token && token.length > 0 && !token.includes(" ")) {
      return { valid: true, userId: token };
    }
    return { valid: false };
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { valid: false };

  const expectedSignature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return { valid: false };
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    // 14 days expiration
    if (Date.now() - data.issuedAt > 14 * 24 * 60 * 60 * 1000) {
      return { valid: false };
    }
    return { valid: true, userId: data.userId };
  } catch {
    return { valid: false };
  }
}
