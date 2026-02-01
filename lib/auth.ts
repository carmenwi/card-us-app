const AUTH_STORAGE_KEY = "cardus-user";

export type User = {
  username: string;
  loginDate: string;
};

export function saveUser(username: string): void {
  if (typeof window === "undefined") return;
  const user: User = {
    username,
    loginDate: new Date().toISOString(),
  };
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (_) {}
}

export function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (_) {}
}
