import crypto from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function b64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function secret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD not configured");
  return s;
}

/**
 * Creates an HMAC-signed session cookie value:
 *   base64url(timestamp_ms) + "." + base64url(HMAC_SHA256(secret, ts))
 * No DB required; verifiable statelessly.
 */
export function createSession(now: number = Date.now()): string {
  const tsB64 = b64url(Buffer.from(String(now)));
  const mac = crypto
    .createHmac("sha256", secret())
    .update(tsB64)
    .digest();
  return `${tsB64}.${b64url(mac)}`;
}

/** Constant-time string compare */
function safeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Verifies a session cookie value. Returns true if the HMAC is valid
 * and the timestamp is within SESSION_MAX_AGE_SECONDS.
 */
export function verifySession(
  value: string | undefined | null,
  now: number = Date.now()
): boolean {
  if (!value || typeof value !== "string") return false;
  const parts = value.split(".");
  if (parts.length !== 2) return false;
  const [tsB64, macB64] = parts;
  let expected: Buffer;
  try {
    expected = crypto
      .createHmac("sha256", secret())
      .update(tsB64)
      .digest();
  } catch {
    return false;
  }
  let got: Buffer;
  try {
    got = fromB64url(macB64);
  } catch {
    return false;
  }
  if (!safeEqual(expected, got)) return false;

  let ts: number;
  try {
    ts = Number(fromB64url(tsB64).toString("utf-8"));
  } catch {
    return false;
  }
  if (!Number.isFinite(ts)) return false;
  if (now - ts > SESSION_MAX_AGE_SECONDS * 1000) return false;
  if (ts > now + 60_000) return false; // future timestamp
  return true;
}

/**
 * Reads the admin session cookie and verifies it.
 * Works in both Route Handlers (using next/headers cookies())
 * and Edge/Node via a passed NextRequest.
 */
export async function isAuthenticated(
  req?: NextRequest | Request
): Promise<boolean> {
  let value: string | undefined;
  if (req && "cookies" in req && typeof (req as NextRequest).cookies?.get === "function") {
    value = (req as NextRequest).cookies.get(SESSION_COOKIE)?.value;
  } else {
    const store = await cookies();
    value = store.get(SESSION_COOKIE)?.value;
  }
  return verifySession(value);
}
