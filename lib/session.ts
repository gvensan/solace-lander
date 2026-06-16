import "server-only";
import { cookies } from "next/headers";
import { getDb } from "./db";
import type { Role } from "./auth";

export interface SessionUser {
  email: string;
  name: string;
  role: Role;
}

// Resolves the current user from the mock-login cookie and authoritative DB role.
// Replace the cookie read with real SolaceID session verification later.
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const email = store.get("lander_uid")?.value;
  if (!email) return null;

  const row = getDb()
    .prepare("SELECT email, name, role FROM users WHERE email = ?")
    .get(decodeURIComponent(email)) as SessionUser | undefined;
  return row ?? null;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === "admin";
}
