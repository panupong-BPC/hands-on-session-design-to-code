"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export function QuickStats() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">{t("workflowManagementStatsTitle")}</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { labelKey: "workflowManagementStatsProcessingCapacity" as const, value: "78%", trend: "+4%" },
            { labelKey: "workflowManagementStatsWeekly" as const, value: "142", trend: "+12" },
            { labelKey: "workflowManagementStatsMom" as const, value: "+8.3%", trend: "vs last" },
          ].map(({ labelKey, value, trend }) => (
            <div key={labelKey} className="rounded-lg bg-muted/50 p-3">
              <p className="text-lg font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t(labelKey)}</p>
              <p className="text-xs text-green-600 mt-1">{trend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">{t("workflowManagementDeadlinesTitle")}</h3>
          <Link
            href="#"
            aria-label="View calendar"
            className="text-xs text-primary hover:underline"
          >
            {t("workflowManagementDeadlinesViewCalendar")}
          </Link>
        </div>
        <ul className="space-y-3">
          {[
            { label: "JOB240001 — Contract review", date: "Tomorrow", urgent: true },
            { label: "JOB240002 — Submission deadline", date: "Apr 25", urgent: false },
            { label: "JOB240003 — Document signing", date: "Apr 27", urgent: false },
          ].map(({ label, date, urgent }) => (
            <li key={label} className="flex items-start gap-3">
              <span
                className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  urgent ? "bg-red-500" : "bg-amber-400"
                }`}
              />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{label}</p>
                <p className="text-xs text-muted-foreground">{date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
