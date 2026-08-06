import { timingSafeEqual } from "node:crypto";

// Node-only (uses node:crypto) — import this only from Node.js runtime code
// such as the login route handler, never from middleware/Edge runtime.

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) return false;
  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}
