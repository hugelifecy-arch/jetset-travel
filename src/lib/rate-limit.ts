const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isConfigured = Boolean(redisUrl && redisToken);

if (!isConfigured) {
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set — " +
      "rate limiting is disabled. Other anti-spam checks (honeypot, timing, " +
      "reCAPTCHA, gibberish) remain active.",
  );
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
    // Rate-limit backend isn't configured — skip this check. The form
    // routes still enforce honeypot, timing, reCAPTCHA, and gibberish
    // checks, so submissions aren't unprotected. A warning was logged
    // at module load so operators notice the missing Upstash config.
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
