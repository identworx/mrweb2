import { createHash } from "crypto";

const MIN_SUBMIT_TIME_MS = 3000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const ipSubmissions = new Map<string, number[]>();

export function hashIP(ip: string): string {
  return createHash("sha256").update(ip + "__mosaroma_salt").digest("hex").slice(0, 16);
}

export function checkHoneypot(body: Record<string, unknown>, honeypotField: string | null): boolean {
  if (!honeypotField) return true;
  const value = body[honeypotField];
  return !value || (typeof value === "string" && value.trim() === "");
}

export function checkMinTime(loadedAt: unknown): boolean {
  if (typeof loadedAt !== "number") return false;
  return Date.now() - loadedAt >= MIN_SUBMIT_TIME_MS;
}

export function checkRateLimit(ipHash: string): boolean {
  const now = Date.now();
  const timestamps = ipSubmissions.get(ipHash) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) return false;

  recent.push(now);
  ipSubmissions.set(ipHash, recent);
  return true;
}

export function getClientIP(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
