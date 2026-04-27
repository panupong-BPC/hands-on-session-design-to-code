"use client";

import { useLanguage } from "@/contexts/language-context";

export function LoanApprovalEngineWidget() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M16.24 7.76a6 6 0 0 1 0 8.49M4.93 19.07a10 10 0 0 1 0-14.14M7.76 16.24a6 6 0 0 1 0-8.49" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{t("workflowManagementWidgetLoanEngineTitle")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("workflowManagementWidgetLoanEngineSubtitle")}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-200 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          {t("workflowManagementWidgetLoanEngineBadge")}
        </span>
      </div>

      {/* Accuracy rate */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">{t("workflowManagementWidgetLoanEngineAccuracy")}</span>
          <span className="text-sm font-bold text-primary">94.7%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: "94.7%" }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Processed", value: "1,247" },
          { label: "Approved", value: "891" },
          { label: "Pending", value: "356" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-muted/50 p-2 text-center">
            <p className="text-sm font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Configure button */}
      <button
        aria-label="Configure Loan Approval Engine"
        className="w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
      >
        {t("workflowManagementWidgetLoanEngineConfigure")}
      </button>
    </div>
  );
}
