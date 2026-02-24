const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

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

export async function enforceRateLimit(ip: string) {
  if (!redisUrl || !redisToken) {
    // Skip external rate limiting when Upstash credentials are not configured.
    return;
  }

  const safeIp = ip || "127.0.0.1";
  const key = `ratelimit:quote:${safeIp}`;
  const nowMs = Date.now();
  const windowStartMs = nowMs - WINDOW_SECONDS * 1000;

  await callPipeline([
    ["ZREMRANGEBYSCORE", key, "-inf", windowStartMs],
    ["ZCARD", key],
  ]);

  const countPayload = await callPipeline([["ZCARD", key]]);
  const currentCount = Number(countPayload?.[0]?.result ?? 0);

  if (currentCount >= MAX_REQUESTS) {
    throw new Error("RATE_LIMIT");
  }

  await callPipeline([
    ["ZADD", key, nowMs, `${nowMs}-${Math.random()}`],
    ["EXPIRE", key, WINDOW_SECONDS],
  ]);
}
