import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "koi_admin_session";
const SESSION_DURATION = "12h";

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(username: string) {
  return new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
