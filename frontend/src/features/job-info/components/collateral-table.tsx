"use client";

import { useLanguage } from "@/contexts/language-context";
import type { CollateralItem } from "../../../../api/client/models/index";

interface CollateralTableProps {
  items: CollateralItem[];
}

function formatCurrency(value: number | undefined | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("th-TH", { style: "decimal", minimumFractionDigits: 2 }).format(value);
}

export function CollateralTable({ items }: CollateralTableProps) {
  const { t } = useLanguage();

  if (items.length === 0) {
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
              {t("jobInfoTableColumnCollateralId")}
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnCollateralType")}
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnTitleDeedNumber")}
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnLandArea")}
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoFieldAppraisalPrice")}
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("jobInfoTableColumnLocation")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.collateralId} className="border-b last:border-b-0">
              <td className="px-3 py-2.5 font-mono text-xs">{item.collateralId ?? "—"}</td>
              <td className="px-3 py-2.5">{item.collateralType ?? "—"}</td>
              <td className="px-3 py-2.5">{item.titleDeedNumber ?? "—"}</td>
              <td className="px-3 py-2.5">{item.landArea ?? "—"}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(item.appraisalPrice)}</td>
              <td className="px-3 py-2.5">{item.location ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
