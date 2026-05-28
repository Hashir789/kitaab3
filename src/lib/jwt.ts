function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padLen);
  if (typeof atob !== "function") return "";
  const binary = atob(base64);
  try {
    return decodeURIComponent(
      binary
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
  } catch {
    return binary;
  }
}

export function getTokenExpiryMs(token: string): number | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as { exp?: number };
    if (typeof payload.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewMs = 0): boolean {
  const expMs = getTokenExpiryMs(token);
  if (expMs === null) return false;
  return Date.now() >= expMs - skewMs;
}
