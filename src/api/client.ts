const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.kitaab.me";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
};

let tokenProvider: () => string | null = () => null;
let unauthorizedHandler: () => void = () => {};

export function setTokenProvider(provider: () => string | null): void {
  tokenProvider = provider;
}

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(
    path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
    typeof window !== "undefined" ? window.location.origin : "http://localhost",
  );

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

const inFlight = new Map<string, Promise<unknown>>();

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, query, headers, method = "GET", signal, skipAuth, ...rest } = options;
  const url = buildUrl(path, query);

  const isIdempotent = method === "GET" || method === "HEAD";
  const cacheKey = isIdempotent ? `${method} ${url}` : null;

  if (cacheKey) {
    const existing = inFlight.get(cacheKey) as Promise<T> | undefined;
    if (existing) return existing;
  }

  const promise = (async () => {
    const token = skipAuth ? null : tokenProvider();

    const response = await fetch(url, {
      ...rest,
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let message = response.statusText;
      try {
        const data = await response.json();
        if (data) {
          if (typeof data.message === "string") {
            message = data.message;
          } else if (Array.isArray(data.message) && data.message.length > 0) {
            message = data.message.join(", ");
          } else if (typeof data.error === "string") {
            message = data.error;
          }
        }
      } catch {
        // response body was not JSON, fall back to statusText
      }

      if (response.status === 401 && !skipAuth) {
        unauthorizedHandler();
      }

      throw new ApiError(response.status, message);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  })();

  if (cacheKey) {
    inFlight.set(cacheKey, promise);
    promise.finally(() => {
      if (inFlight.get(cacheKey) === promise) inFlight.delete(cacheKey);
    });
  }

  return promise;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
