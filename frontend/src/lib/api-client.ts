/**
 * Client-side API fetch utility.
 *
 * Reads the JWT from sessionStorage (set by useLogin after a successful login)
 * and automatically injects `Authorization: Bearer <token>` into every request.
 *
 * Usage (inside a client component or hook):
 *   import { apiFetch } from "@/lib/api-client";
 *   const res = await apiFetch("/rest/api/v1/some/endpoint");
 *   const data = await res.json();
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8087";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("auth_token");
}

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${BACKEND_URL}${path}`, { ...init, headers });
}
