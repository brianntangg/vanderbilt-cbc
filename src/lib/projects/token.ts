import { createHmac, timingSafeEqual } from "node:crypto";

export const TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000;

type VerifyResult = { ok: true; id: string } | { ok: false; reason: "malformed" | "bad-signature" | "expired" };

function mac(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Token format: `${id}.${expiresAt}.${hmac}`. Project ids are UUIDs, so they never contain a dot. */
export function signToken(id: string, secret: string, now: number = Date.now()): string {
  const payload = `${id}.${now + TOKEN_TTL_MS}`;
  return `${payload}.${mac(payload, secret)}`;
}

export function verifyToken(token: string, secret: string, now: number = Date.now()): VerifyResult {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed" };
  const [id, expiresAt, signature] = parts;
  if (!id || !signature || !/^\d+$/.test(expiresAt)) return { ok: false, reason: "malformed" };

  const expected = Buffer.from(mac(`${id}.${expiresAt}`, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { ok: false, reason: "bad-signature" };
  }
  if (now >= Number(expiresAt)) return { ok: false, reason: "expired" };
  return { ok: true, id };
}
