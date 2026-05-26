import { readString, writeString } from "./storage.ts";

const KEY = "kitaab.anonymous_id";

function generateAnonymousId(): string {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getAnonymousId(): string {
  const existing = readString(KEY);
  if (existing) return existing;
  const fresh = generateAnonymousId();
  writeString(KEY, fresh);
  return fresh;
}
