/**
 * Simple in-memory sliding-window rate limiter.
 * Works in Node.js runtime API routes (not Edge).
 * State is per-instance — restarts clear all counts.
 */

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

/**
 * @param key      Unique key (e.g. "register:1.2.3.4")
 * @param limit    Max allowed requests in the window
 * @param windowMs Window duration in ms
 * @returns true if the request is allowed, false if rate-limited
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}
