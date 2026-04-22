const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isConfigured = Boolean(redisUrl && redisToken);

if (!isConfigured) {
  if (process.env.NODE_ENV === "production") {
    // Fail-closed in production: a misconfigured deploy must not run with
    // rate limiting silently disabled. The route handlers call
    // enforceRateLimit() and will surface this as a 500, which is the
    // correct behavior — better to reject submissions than accept
    // unlimited spam from a single IP.
    console.error(
      "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set. " +
        "Rate limiting is REQUIRED in production. Requests to rate-limited endpoints will fail.",
    );
  } else {
    console.warn(
      "[rate-limit] Upstash credentials not set — rate limiting disabled (development only).",
    );
  }
}

async function callPipeline(commands: unknown[][]) {
  if (!redisUrl || !redisToken) {
    return null;
  }

  const response = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`RATE_LIMIT_BACKEND_ERROR:${response.status}`);
  }

  const payload = (await response.json()) as Array<{ result?: unknown; error?: string }>;

  for (const item of payload) {
    if (item.error) {
      throw new Error(`RATE_LIMIT_BACKEND_ERROR:${item.error}`);
    }
  }

  return payload;
}

/**
 * Sliding-window rate limiter backed by Upstash Redis.
 *
 * scope lets callers use separate buckets per endpoint (e.g. "contact",
 * "quote", "cruise-enquiry") so a user's quote submissions don't count
 * against their contact submissions.
 *
 * Concurrency-safe: we ZADD first, then ZCARD, and reject when the
 * post-add count exceeds the limit. This closes the TOCTOU window that
 * existed when we read count before adding — two concurrent requests
 * can no longer both observe count < MAX and both slip through.
 */
export async function enforceRateLimit(ip: string, scope: string = "default") {
  if (!redisUrl || !redisToken) {
    if (process.env.NODE_ENV === "production") {
      // Fail closed — rate limiting is a security control, not a nicety.
      throw new Error("RATE_LIMIT_NOT_CONFIGURED");
    }
    // Non-production: skip (already warned at module load).
    return;
  }

  const safeIp = ip || "127.0.0.1";
  const safeScope = scope.replace(/[^a-zA-Z0-9_-]/g, "_");
  const key = `ratelimit:${safeScope}:${safeIp}`;
  const nowMs = Date.now();
  const windowStartMs = nowMs - WINDOW_SECONDS * 1000;
  const member = `${nowMs}-${Math.random()}`;

  const payload = await callPipeline([
    ["ZREMRANGEBYSCORE", key, "-inf", windowStartMs],
    ["ZADD", key, nowMs, member],
    ["ZCARD", key],
    ["EXPIRE", key, WINDOW_SECONDS],
  ]);

  const currentCount = Number(payload?.[2]?.result ?? 0);

  if (currentCount > MAX_REQUESTS) {
    // Remove the entry we just added so a blocked request doesn't
    // consume a slot it will never use.
    await callPipeline([["ZREM", key, member]]).catch(() => {
      /* best-effort cleanup; don't surface secondary errors */
    });
    throw new Error("RATE_LIMIT");
  }
}
