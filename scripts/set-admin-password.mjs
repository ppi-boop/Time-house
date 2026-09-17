/**
 * Sets the admin panel password.
 *
 *   npm run admin:password -- 'the new password'
 *
 * Hashes it with scrypt and writes ADMIN_PASSWORD_HASH into .env.local. The
 * password itself is never stored anywhere; lose it and you set a new one.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scryptAsync = promisify(scrypt);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = join(root, ".env.local");

const password = process.argv.slice(2).join(" ").trim();
if (!password) {
  console.error("Usage: npm run admin:password -- 'your new password'");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Use at least 8 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const derived = await scryptAsync(password, salt, 64);
const hash = `scrypt:${salt}:${derived.toString("hex")}`;

let env = existsSync(envFile) ? readFileSync(envFile, "utf8") : "";
env = env.match(/^ADMIN_PASSWORD_HASH=.*$/m)
  ? env.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${hash}`)
  : `${env.trimEnd()}\nADMIN_PASSWORD_HASH=${hash}\n`;

if (!env.match(/^ADMIN_SESSION_SECRET=.+$/m)) {
  env = `${env.trimEnd()}\nADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}\n`;
  console.log("Also generated ADMIN_SESSION_SECRET.");
}

writeFileSync(envFile, env);
console.log("Password set. Restart the dev server, then sign in at /admin/login.");
