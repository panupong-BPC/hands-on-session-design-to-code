"use client";

import { useLanguage } from "@/contexts/language-context";

export function CreditInsightsWidget() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-amber-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{t("workflowManagementWidgetCreditInsightsTitle")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("workflowManagementWidgetCreditInsightsSubtitle")}</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 border border-red-200 shrink-0">
          {t("workflowManagementWidgetCreditInsightsAlert")}
        </span>
      </div>

      {/* Risk breakdown */}
      <div className="space-y-2 mb-4">
        {[
          { label: "High Risk", value: 12, color: "bg-red-500", pct: "12%" },
          { label: "Medium Risk", value: 34, color: "bg-amber-400", pct: "34%" },
          { label: "Low Risk", value: 54, color: "bg-green-500", pct: "54%" },
        ].map(({ label, value, color, pct }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-24 text-xs text-muted-foreground shrink-0">{label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: pct }} />
            </div>
            <span className="w-8 text-right text-xs font-medium">{value}%</span>
          </div>
        ))}
      </div>

      {/* Alert detail */}
      <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
        <p className="text-xs font-medium text-red-700">3 accounts flagged for review</p>
        <p className="text-xs text-red-600 mt-0.5">Unusual transaction patterns detected</p>
      </div>
    </div>
  );
}
