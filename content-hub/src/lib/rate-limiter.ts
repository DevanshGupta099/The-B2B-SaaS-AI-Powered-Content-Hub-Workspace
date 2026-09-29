/**
 * Nexus Enterprise Rate Limiter ("Denial of Wallet" Protection)
 * High-performance sliding-window in-memory rate limiting.
 * Protects AI inference endpoints and LLM token budgets from automated abuse,
 * credential stuffing, and quota exhaustion attacks.
 */

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding log map
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection interval
const GC_INTERVAL_MS = 60 * 1000; // 1 minute
let lastGC = Date.now();

/**
 * Checks if the given key has exceeded the rate limit within the specified window.
 *
 * @param key Unique client identifier (IP address, user ID, or API key)
 * @param limit Maximum allowed requests within the time window (default: 30)
 * @param windowMs Time window duration in milliseconds (default: 60,000ms / 1 min)
 */
export function checkRateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();

  // Clean expired entries periodically to prevent memory leaks
  if (now - lastGC > GC_INTERVAL_MS) {
    lastGC = now;
    const maxExpiry = now - windowMs * 2;
    for (const [storedKey, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => t > maxExpiry);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(storedKey);
      }
    }
  }

  const record = rateLimitStore.get(key) || { timestamps: [] };
  const windowStart = now - windowMs;

  // Filter timestamps to only retain those inside the current rolling window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetSeconds,
    };
  }

  // Record this request timestamp
  record.timestamps.push(now);
  rateLimitStore.set(key, record);

  const remaining = Math.max(0, limit - record.timestamps.length);
  const resetSeconds = Math.ceil(windowMs / 1000);

  return {
    allowed: true,
    limit,
    remaining,
    resetSeconds,
  };
}

/**
 * Helper to extract client identifier (IP address or authenticated session ID)
 */
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";

  // Check for session cookie if present
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionMatch = cookieHeader.match(/nexus_session=([^;]+)/);
  if (sessionMatch && sessionMatch[1]) {
    // Hash or slice session token for identifier
    return `user:${sessionMatch[1].slice(0, 16)}`;
  }

  return `ip:${ip}`;
}
