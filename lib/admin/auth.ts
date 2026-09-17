import { createHmac, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Admin sign-in for a single shop owner: one password, hashed with scrypt in
 * .env.local, and a signed cookie to keep the session. No user table and no
 * third-party provider — there is exactly one person who edits this catalogue.
 */
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

export const SESSION_COOKIE = "time-house-admin";
const SESSION_DAYS = 7;

/**
 * The stored hash is `scrypt:<salt>:<derived key>` — self-describing, so the
 * format can change later. It is written by `npm run admin:password`, which
 * derives it in plain JS; nothing here needs to produce one.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, key] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !key) return false;

  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(key, "hex");
  // Same length is guaranteed by KEY_LENGTH, but guard anyway: timingSafeEqual
  // throws rather than returning false when the buffers differ in size.
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not set — see .env.example.");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** `<expires-at>.<signature>` — stateless, so signing out just clears the cookie. */
export function createSessionToken(): { value: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const expires = Date.now() + maxAge * 1000;
  return { value: `${expires}.${sign(String(expires))}`, maxAge };
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;

  const expected = sign(expires);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/** False when no password has been set yet, so the UI can say so plainly. */
export const isAdminConfigured = Boolean(process.env.ADMIN_PASSWORD_HASH);
