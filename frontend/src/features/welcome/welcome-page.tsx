"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/login/actions";

interface AuthUser {
  userId: string;
  fullName: string;
  role: string;
  branchCode: string;
  branchName: string;
}

const brandMarkIconClassName = "h-[14px] w-[14px] fill-none stroke-white";
const quickActionIconClassName = "h-[15px] w-[15px] fill-none stroke-current";

const QUICK_ACTIONS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className={quickActionIconClassName} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 12l3 3 5-5" />
      </svg>
    ),
    label: "Workflow Management",
    description: "Monitor and manage lending jobs",
    href: "/workflow-management",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className={quickActionIconClassName} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
    label: "Account Overview",
    description: "View balances and recent transactions",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className={quickActionIconClassName} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    label: "Transfer Funds",
    description: "Domestic and international wire transfers",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className={quickActionIconClassName} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    label: "Statements",
    description: "Download or view account statements",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className={quickActionIconClassName} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    ),
    label: "Trade Finance",
    description: "Letters of credit and trade documents",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className={quickActionIconClassName} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    label: "Cash Flow",
    description: "Analytics and forecasting tools",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className={quickActionIconClassName} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M16.24 7.76a6 6 0 0 1 0 8.49" />
        <path d="M4.93 19.07a10 10 0 0 1 0-14.14M7.76 16.24a6 6 0 0 1 0-8.49" />
      </svg>
    ),
    label: "Support",
    description: "Contact your relationship manager",
  },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getRoleLabel(role: string): string {
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("auth_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        // ignore malformed value
      }
    }
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    await logoutAction();
    router.push("/login");
  }

  const displayName = user?.fullName ?? user?.userId ?? "User";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-screen" style={{ background: "var(--page-background-alt)" }}>
      {/* ── Top navigation bar ── */}
      <header
        className="sticky top-0 z-40 border-b px-4 sm:px-6 lg:px-8"
        style={{
          background: "var(--app-surface-strong)",
          borderColor: "var(--surface-border)",
          boxShadow: "var(--app-shadow-sm)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          {/* Logo + wordmark */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "var(--app-accent-gradient)",
                boxShadow: "0 3px 8px color-mix(in srgb, var(--color-brand) 24%, transparent)",
              }}
            >
              <svg viewBox="0 0 24 24" className={brandMarkIconClassName} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
              >
                One Corporate Portal
              </span>
            </div>
          </div>

          {/* Right: user info + logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {user.fullName}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            )}

            {/* Avatar */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ background: "var(--app-accent-gradient)" }}
              aria-hidden
            >
              {initials || "U"}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                color: "var(--color-text-secondary)",
                background: "transparent",
                border: "1px solid var(--color-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text-primary)";
                e.currentTarget.style.background = "var(--color-background-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {isLoggingOut ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              )}
              <span className="hidden sm:inline">{isLoggingOut ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

        {/* Hero greeting card */}
        <div
          className="mb-8 overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10"
          style={{
            background: "var(--app-accent-gradient)",
            boxShadow: "var(--app-shadow-md)",
          }}
        >
          <div className="relative">
            {/* Decorative circle */}
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full lg:h-64 lg:w-64"
              style={{ background: "rgba(255,255,255,0.06)" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-8 right-16 h-32 w-32 rounded-full"
              style={{ background: "rgba(255,255,255,0.04)" }}
              aria-hidden
            />

            <p
              className="mb-1 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.70)", fontFamily: "var(--font-body)" }}
            >
              {getGreeting()},
            </p>
            <h1
              className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "var(--tracking-tight)" }}
            >
              {displayName}
            </h1>

            {user && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.92)" }}
                >
                  <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {getRoleLabel(user.role)}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.92)" }}
                >
                  <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {user.branchName} ({user.branchCode})
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.92)" }}
                >
                  <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section heading */}
        <div className="mb-5">
          <h2
            className="text-lg font-semibold sm:text-xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            Quick Actions
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Navigate to frequently used services
          </p>
        </div>

        {/* Quick action grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                if ("href" in action && action.href) {
                  router.push(action.href);
                }
              }}
              className="group flex items-start gap-3.5 rounded-2xl p-5 text-left transition-all duration-200 active:scale-[0.98]"
              style={{
                background: "var(--app-surface-strong)",
                border: "1px solid var(--surface-border)",
                boxShadow: "0 2px 8px color-mix(in srgb, var(--palette-big-stone-950) 5%, transparent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--app-shadow-sm)";
                e.currentTarget.style.borderColor = "var(--color-brand-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px color-mix(in srgb, var(--palette-big-stone-950) 5%, transparent)";
                e.currentTarget.style.borderColor = "var(--surface-border)";
              }}
            >
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-200"
                style={{
                  background: "var(--color-brand-tertiary)",
                  color: "var(--color-brand)",
                }}
              >
                {action.icon}
              </div>
              <div className="min-w-0">
                <p
                  className="font-semibold text-sm"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
                >
                  {action.label}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {action.description}
                </p>
              </div>
              <svg
                viewBox="0 0 24 24"
                className="ml-auto h-3.5 w-3.5 shrink-0 self-center fill-none stroke-current opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--color-brand)" }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          © {new Date().getFullYear()} Krungsri One Corporate Portal · Logged in as {user?.userId ?? "—"}
        </p>
      </main>
    </div>
  );
}
