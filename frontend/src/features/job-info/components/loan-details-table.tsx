"use client";

import { useLanguage } from "@/contexts/language-context";
import type { LoanDetail } from "../../../../api/client/models/index";

interface LoanDetailsTableProps {
  loanDetails: LoanDetail[];
}

function formatCurrency(value: number | undefined | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("th-TH", { style: "decimal", minimumFractionDigits: 2 }).format(value);
}

function formatRate(value: number | undefined | null): string {
  if (value == null) return "—";
  return `${value.toFixed(2)}%`;
}

export function LoanDetailsTable({ loanDetails }: LoanDetailsTableProps) {
  const { t } = useLanguage();

  if (loanDetails.length === 0) {
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
              {t("jobInfoTableColumnProductCode")}
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnProductName")}
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnCreditLimit")}
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnOutstandingBalance")}
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnInterestRate")}
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnLoanType")}
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnTenor")}
            </th>
          </tr>
        </thead>
        <tbody>
          {loanDetails.map((d, i) => (
            <tr key={d.productCode ?? i} className="border-b last:border-b-0">
              <td className="px-3 py-2.5 font-mono text-xs">{d.productCode ?? "—"}</td>
              <td className="px-3 py-2.5">{d.productName ?? "—"}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(d.creditLimit)}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(d.outstandingBalance)}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{formatRate(d.interestRate)}</td>
              <td className="px-3 py-2.5">{d.loanType ?? "—"}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">
                {d.tenor != null ? `${d.tenor} mo.` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
