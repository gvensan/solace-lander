"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Role = "member" | "admin";

export interface SolaceUser {
  name: string;
  email: string;
  role: Role;
}

// Demo SolaceID accounts to exercise the gate + admin role. Swap for real SolaceID OIDC later.
export const DEMO_ACCOUNTS: SolaceUser[] = [
  { name: "Attendee (Dana)", email: "attendee@solace.com", role: "member" },
  { name: "You (Giri)", email: "gvensan21@gmail.com", role: "member" },
  { name: "Guest (no workshops)", email: "guest@example.com", role: "member" },
  { name: "DevRel Admin", email: "admin@solace.com", role: "admin" },
];

const COOKIE = "lander_uid";

function setCookie(email: string) {
  document.cookie = `${COOKIE}=${encodeURIComponent(email)}; path=/; max-age=604800; samesite=lax`;
}
function clearCookie() {
  document.cookie = `${COOKIE}=; path=/; max-age=0; samesite=lax`;
}

// The cookie is the single source of truth for the mock session. We read it via
// useSyncExternalStore so a refresh stays logged in without a setState-in-effect, and
// SSR renders the logged-out snapshot (no hydration mismatch). readUser returns a stable
// DEMO_ACCOUNTS reference, so the snapshot is referentially stable between renders.
const listeners = new Set<() => void>();
function notifyAuth() {
  listeners.forEach((l) => l());
}
function subscribeAuth(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function readUser(): SolaceUser | null {
  const match = document.cookie.match(/(?:^|; )lander_uid=([^;]+)/);
  if (!match) return null;
  const email = decodeURIComponent(match[1]);
  return DEMO_ACCOUNTS.find((a) => a.email === email) ?? null;
}
const serverUser = () => null;

interface AuthState {
  user: SolaceUser | null;
  login: (user: SolaceUser) => void;
  logout: () => void;
  /** v1 gate: logged in AND email is on the workshop's attendee list. */
  hasAttended: (attendees: string[]) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore<SolaceUser | null>(subscribeAuth, readUser, serverUser);

  const login = useCallback((u: SolaceUser) => {
    setCookie(u.email); // lets the server identify the user for /admin role checks
    notifyAuth(); // re-read the cookie-backed store
  }, []);
  const logout = useCallback(() => {
    clearCookie();
    notifyAuth();
  }, []);
  const hasAttended = useCallback(
    (attendees: string[]) =>
      !!user && attendees.map((a) => a.toLowerCase()).includes(user.email.toLowerCase()),
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAttended }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
