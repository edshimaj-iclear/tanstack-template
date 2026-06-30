import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE = "iclear_session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-please-change-32-characters-min"
);

export type SessionUser = { id: string; email: string; name: string; role: string };

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.active) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role } as SessionUser;
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: payload.id as string, email: payload.email as string, name: payload.name as string, role: payload.role as string };
  } catch {
    return null;
  }
}

// Roles allowed to release product / sign final QC / advance critical steps
export const RELEASE_ROLES = ["TECHNICAL_DIRECTOR", "QUALITY_MANAGER", "CEO"];
export function canRelease(role: string) {
  return RELEASE_ROLES.includes(role);
}
