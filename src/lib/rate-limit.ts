const MAX_REQUESTS = 10;
const WINDOW_MS = 10 * 60 * 1000;

const requestLog = new Map<string, number[]>();

export async function enforceRateLimit(ip: string) {
  const now = Date.now();
  const key = `quote:${ip}`;
  const timestamps = requestLog.get(key) ?? [];
  const recent = timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    throw new Error("RATE_LIMIT");
  }

  recent.push(now);
  requestLog.set(key, recent);
}
