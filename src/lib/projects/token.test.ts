import { describe, expect, it } from "vitest";
import { signToken, TOKEN_TTL_MS, verifyToken } from "./token";

const secret = "test-secret";
const now = 1_700_000_000_000;

describe("review tokens", () => {
  it("round-trips a valid token to its id", () => {
    const token = signToken("abc-123", secret, now);
    expect(verifyToken(token, secret, now)).toEqual({ ok: true, id: "abc-123" });
  });

  it("rejects a token signed with a different secret (bad-signature)", () => {
    const token = signToken("abc-123", "other-secret", now);
    expect(verifyToken(token, secret, now)).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects a token whose id or expiry was edited (bad-signature)", () => {
    const [id, expiresAt, sig] = signToken("abc-123", secret, now).split(".");
    expect(verifyToken(`other-id.${expiresAt}.${sig}`, secret, now)).toEqual({ ok: false, reason: "bad-signature" });
    const later = String(Number(expiresAt) + 1_000_000);
    expect(verifyToken(`${id}.${later}.${sig}`, secret, now)).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects after 14 days (expired)", () => {
    const token = signToken("abc-123", secret, now);
    expect(verifyToken(token, secret, now + TOKEN_TTL_MS)).toEqual({ ok: false, reason: "expired" });
  });

  it("accepts at 14 days minus 1 ms", () => {
    const token = signToken("abc-123", secret, now);
    expect(verifyToken(token, secret, now + TOKEN_TTL_MS - 1)).toEqual({ ok: true, id: "abc-123" });
  });

  it.each(["", "garbage", "only.two", "a.b.c.d", "a.notanumber.sig"])("rejects %j (malformed)", (token) => {
    expect(verifyToken(token, secret, now)).toEqual({ ok: false, reason: "malformed" });
  });
});
