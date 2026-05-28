import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/auth.ts";
import type { AuthUser, LoginResponse } from "../api/auth.ts";
import { setTokenProvider, setUnauthorizedHandler } from "../api/client.ts";
import { getAnonymousId } from "../lib/anonymousId.ts";
import { getTokenExpiryMs, isTokenExpired } from "../lib/jwt.ts";
import { readJSON, readString, remove, writeJSON, writeString } from "../lib/storage.ts";

const TOKEN_KEY = "kitaab.auth.token";
const USER_KEY = "kitaab.auth.user";
const EMAIL_KEY = "kitaab.auth.email";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_MAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS;
const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loginEmail: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const readValidToken = (): string | null => {
  const stored = readString(TOKEN_KEY);
  if (!stored) return null;
  if (isTokenExpired(stored)) {
    remove(TOKEN_KEY);
    remove(USER_KEY);
    remove(EMAIL_KEY);
    return null;
  }
  return stored;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => readValidToken());
  const [user, setUser] = useState<AuthUser | null>(() =>
    readString(TOKEN_KEY) ? readJSON<AuthUser>(USER_KEY) : null,
  );
  const [loginEmail, setLoginEmail] = useState<string | null>(() =>
    readString(TOKEN_KEY) ? readString(EMAIL_KEY) : null,
  );

  const tokenRef = useRef(token);
  tokenRef.current = token;
  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSession = useCallback(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
    remove(TOKEN_KEY);
    remove(USER_KEY);
    remove(EMAIL_KEY);
    setToken(null);
    setUser(null);
    setLoginEmail(null);
  }, []);

  const scheduleExpiry = useCallback(
    (accessToken: string) => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
      const expMs = getTokenExpiryMs(accessToken);
      if (expMs === null) return;
      const delay = expMs - Date.now();
      if (delay <= 0) {
        clearSession();
        return;
      }
      expiryTimerRef.current = setTimeout(clearSession, delay);
    },
    [clearSession],
  );

  // Register synchronously during render so child effects on initial mount
  // see the token and 401 handler before they fire their first requests.
  setTokenProvider(() => tokenRef.current);
  setUnauthorizedHandler(clearSession);

  useEffect(() => {
    if (token) scheduleExpiry(token);
    return () => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    };
  }, [token, scheduleExpiry]);

  const login = useCallback(async (email: string, password: string) => {
    if (
      !ADMIN_EMAIL ||
      !ADMIN_PASSWORD ||
      email !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {
      throw new Error(INVALID_CREDENTIALS_MESSAGE);
    }

    const response: LoginResponse = await authApi.login({
      anonymous_id: getAnonymousId(),
      email,
      password,
    });

    const { access_token, ...rest } = response;
    const nextUser: AuthUser = rest;

    writeString(TOKEN_KEY, access_token);
    writeJSON(USER_KEY, nextUser);
    writeString(EMAIL_KEY, email);
    setToken(access_token);
    setUser(nextUser);
    setLoginEmail(email);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loginEmail,
      isAuthenticated: Boolean(token),
      login,
      logout: clearSession,
    }),
    [user, token, loginEmail, login, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
