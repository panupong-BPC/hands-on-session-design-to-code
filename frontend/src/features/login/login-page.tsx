"use client";

import { useState } from "react";
import { useLogin } from "@/features/login/hooks/use-login";

export function LoginPage() {
  const { handleLogin, isLoading, error } = useLogin();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleLogin({ userId, password });
  }

  const activeFieldBackground = "color-mix(in srgb, var(--color-brand) 4%, var(--color-background))";

    
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-8"
      style={{ background: "var(--color-background)" }}
    >
      <div className="w-full max-w-[768px]">
        <div className="text-center">
          <h2
            className="text-[30px] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            Krungsri - One Corporate Portal
          </h2>
        </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl px-4 py-3"
              style={{
                background: "var(--color-danger-tertiary)",
                border: "1px solid var(--color-danger-secondary)",
              }}
            >
              <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" style={{ fill: "var(--color-danger)" }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.75a.75.75 0 001.5 0V8a.75.75 0 00-1.5 0v4.25zm.75 2.5a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
              </svg>
              <p className="text-sm leading-6" style={{ color: "var(--color-text-danger-primary)" }}>
                {error}
              </p>
            </div>
          )}

          <div
            className="overflow-hidden rounded-[18px] border"
            style={{
              borderColor: "var(--color-border-secondary)",
              background: "var(--color-background)",
              boxShadow: "0 12px 30px color-mix(in srgb, var(--palette-big-stone-950) 7%, transparent)",
            }}
          >
            <div
              className="transition-colors duration-150"
              style={{
                background: focusedField === "userId" ? activeFieldBackground : "var(--color-background)",
              }}
            >
              <label htmlFor="userId" className="sr-only">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                autoComplete="username"
                autoFocus
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
                disabled={isLoading}
                className="block h-[68px] w-full bg-transparent px-5 text-lg outline-none transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[72px] sm:px-6 sm:text-[20px]"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={() => setFocusedField("userId")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div className="h-px w-full" style={{ background: "var(--color-border)" }} />

            <div
              className="transition-colors duration-150"
              style={{
                background: focusedField === "password" ? activeFieldBackground : "var(--color-background)",
              }}
            >
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={isLoading}
                className="block h-[68px] w-full bg-transparent px-5 text-lg outline-none transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[72px] sm:px-6 sm:text-[20px]"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 sm:mt-8">
            <label
              className="inline-flex items-center gap-4 text-base sm:text-[18px]"
              style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-8 w-8 rounded-[10px] border-[1.5px] disabled:cursor-not-allowed"
                style={{
                  accentColor: "var(--palette-brand-600)",
                  borderColor: "var(--color-border-secondary)",
                }}
              />
              <span className="leading-none">Remember me</span>
            </label>

            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="text-base font-semibold transition-opacity duration-150 hover:opacity-80 sm:text-[18px]"
              style={{ color: "var(--palette-brand-600)", fontFamily: "var(--font-body)" }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading || !userId || !password}
            className="mt-10 flex h-[68px] w-full items-center justify-center gap-2 rounded-[16px] px-4 text-lg font-semibold text-white transition-all duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[72px] sm:text-[20px]"
            style={{
              background: "linear-gradient(90deg, var(--palette-brand-600) 0%, var(--palette-brand-500) 100%)",
              boxShadow: "0 16px 30px color-mix(in srgb, var(--palette-brand-600) 24%, transparent)",
              fontFamily: "var(--font-display)",
            }}
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      </div>
    </div>
   );
}
