import { cookies } from "next/headers";
import type { User } from "../types/auth.types";
import { AUTH_TOKEN_COOKIE, AUTH_USER_COOKIE } from "./cookie-constants";

export { AUTH_TOKEN_COOKIE, AUTH_USER_COOKIE };

export async function setAuthCookies(
  token: string,
  user: User,
  rememberMe: boolean = true
) {
  const cookieStore = await cookies();
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days or 7 days

  const cookieOptions = {
    path: "/",
    maxAge,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: false, // Allows both server and client to access token
  };

  cookieStore.set(AUTH_TOKEN_COOKIE, token, cookieOptions);
  cookieStore.set(AUTH_USER_COOKIE, JSON.stringify(user), cookieOptions);
}

export async function getAuthTokenServer(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value || null;
}

export async function getAuthUserServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(AUTH_USER_COOKIE);
}
