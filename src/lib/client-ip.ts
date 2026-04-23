/**
 * Resolve the client IP from a request in a way that can't be spoofed by
 * arbitrary `X-Forwarded-For` values supplied by the caller.
 *
 * The previous implementation read `request.headers.get("x-forwarded-for")`
 * and took the LEFTMOST entry. On Vercel (and most reverse proxies) the
 * real client IP is APPENDED by the trusted edge, so the leftmost value
 * is whatever the attacker sent — making rate limiting trivially
 * bypassable by rotating XFF header values.
 *
 * Resolution order:
 *   1. `x-vercel-forwarded-for` — set by Vercel's edge, attacker-supplied
 *      copies of this header are stripped before the function runs.
 *   2. `x-real-ip` — set by most reverse proxies (including Vercel) to
 *      the immediate peer, i.e. the actual client.
 *   3. Rightmost entry of `x-forwarded-for` — the one appended by the
 *      last trusted proxy hop. Still better than the leftmost value,
 *      which is fully attacker-controlled.
 *
 * Returns "unknown" only when the request has none of these headers.
 */
export function getClientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const first = vercel.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    const trimmed = realIp.trim();
    if (trimmed) return trimmed;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }

  return "unknown";
}
