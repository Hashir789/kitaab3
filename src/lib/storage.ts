const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function readJSON<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage may be unavailable (private mode, quota exceeded); fail silently
  }
}

export function readString(key: string): string | null {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // fail silently
  }
}

export function remove(key: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // fail silently
  }
}
