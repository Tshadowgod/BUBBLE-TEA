import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/adminSession";
import { verifyAdminCredentials } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const token = await createAdminSessionToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
