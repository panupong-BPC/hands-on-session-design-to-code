"use client";

import { useLanguage } from "@/contexts/language-context";
import { StatusBadge } from "@/components/status-badge";
import type { LoanApplicant } from "../../../../api/client/models/index";

interface LoanApplicantsTableProps {
  applicants: LoanApplicant[];
}

export function LoanApplicantsTable({ applicants }: LoanApplicantsTableProps) {
  const { t } = useLanguage();

  if (applicants.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t("jobInfoNoDataText")}</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnName")}
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnRole")}
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnIdCardNumber")}
            </th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((a) => (
            <tr key={a.id ?? a.idCardNumber} className="border-b last:border-b-0">
              <td className="px-3 py-2.5 font-medium">{a.name ?? "—"}</td>
              <td className="px-3 py-2.5">
                {a.role ? (
                  <StatusBadge
                    label={a.role}
                    variant={
                      a.role.toLowerCase().includes("main") ||
                      a.role.toLowerCase().includes("borrower")
                        ? "in-progress"
                        : "default"
                    }
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="px-3 py-2.5 font-mono text-xs">{a.idCardNumber ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
