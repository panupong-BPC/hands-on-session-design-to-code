"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginResult =
  | { success: true; token: string; user: { userId: string; fullName: string; role: string; branchCode: string; branchName: string } }
  | { success: false; message: string };

export async function loginAction(values: { userId: string; password: string }): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const apiBase = process.env.BACKEND_URL ?? "http://localhost:8087";

  try {
    const res = await fetch(`${apiBase}/rest/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: parsed.data.userId, password: parsed.data.password }),
      cache: "no-store",
    });

    const body = await res.json();

    if (!res.ok || body.status !== "success") {
      return { success: false, message: body.message ?? "Login failed" };
    }

    const { token, expiresAt, user } = body.data;

    // Set HttpOnly cookie so middleware can protect routes server-side.
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(expiresAt),
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true, token, user };
  } catch {
    return { success: false, message: "Unable to connect to server. Please try again." };
  }
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete("auth_token");
}
