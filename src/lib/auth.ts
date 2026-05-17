import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured.");
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(username: string) {
  return new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload.role === "admin";
}

export async function getAdminUsernameFromToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  if (payload.role !== "admin" || typeof payload.username !== "string") {
    return null;
  }
  return payload.username;
}

export async function isAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    return await verifyAdminToken(token);
  } catch {
    return false;
  }
}

export async function getAdminUsernameFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await getAdminUsernameFromToken(token);
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
