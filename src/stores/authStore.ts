import type { AuthSession, AuthUser } from "@/lib/types";

const TOKEN_KEY = "recoverpack:auth";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function saveSession(session: AuthSession): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return loadSession()?.accessToken ?? null;
}

export function getUser(): AuthUser | null {
  return loadSession()?.user ?? null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function clearSession(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
}
