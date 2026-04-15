import { supabase } from "./supabase";
import { RATE_LIMIT } from "./constants";

// ============================================
// ChatKu AI — Rate Limiter (Supabase-backed)
// ============================================

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Check and enforce rate limiting for a given identifier (IP or token).
 * Uses a sliding window approach stored in Supabase.
 *
 * @param identifier - The IP address or session token to rate limit
 * @returns Whether the request is allowed and remaining quota
 */
export async function checkRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  const windowMs = RATE_LIMIT.WINDOW_SECONDS * 1000;
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  try {
    // Try to find existing rate limit record
    const { data: existing, error: fetchError } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("identifier", identifier)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows returned, which is fine for new identifiers
      console.error("Rate limit fetch error:", fetchError);
      // Fail open — allow the request if we can't check
      return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS, retryAfterSeconds: 0 };
    }

    if (!existing) {
      // First request from this identifier — create record
      await supabase.from("rate_limits").insert({
        identifier,
        request_count: 1,
        window_start: now.toISOString(),
      });

      return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_REQUESTS - 1,
        retryAfterSeconds: 0,
      };
    }

    const existingWindowStart = new Date(existing.window_start);

    // Check if the window has expired
    if (existingWindowStart < windowStart) {
      // Reset the window
      await supabase
        .from("rate_limits")
        .update({
          request_count: 1,
          window_start: now.toISOString(),
        })
        .eq("identifier", identifier);

      return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_REQUESTS - 1,
        retryAfterSeconds: 0,
      };
    }

    // Window is still active — check count
    if (existing.request_count >= RATE_LIMIT.MAX_REQUESTS) {
      const windowEndTime = existingWindowStart.getTime() + windowMs;
      const retryAfterSeconds = Math.ceil((windowEndTime - now.getTime()) / 1000);

      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(retryAfterSeconds, 1),
      };
    }

    // Increment counter
    await supabase
      .from("rate_limits")
      .update({
        request_count: existing.request_count + 1,
      })
      .eq("identifier", identifier);

    return {
      allowed: true,
      remaining: RATE_LIMIT.MAX_REQUESTS - existing.request_count - 1,
      retryAfterSeconds: 0,
    };
  } catch (error) {
    console.error("Rate limiter error:", error);
    // Fail open
    return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS, retryAfterSeconds: 0 };
  }
}

/**
 * Get the client IP address from the request headers.
 * Works with Vercel's x-forwarded-for header.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}
