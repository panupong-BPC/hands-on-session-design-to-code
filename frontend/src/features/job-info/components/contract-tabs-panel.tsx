"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import type { TranslationKey } from "@/lib/data";
import type { ContractGroup, ContractDocument } from "../types";

type TabId = "contracts" | "documents" | "comments";

interface ContractTabsPanelProps {
  contracts: ContractGroup[];
  isLoading: boolean;
  onMarkReviewed: (contractId: string, documentId: string) => Promise<void>;
}

export function ContractTabsPanel({
  contracts,
  isLoading,
  onMarkReviewed,
}: ContractTabsPanelProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("contracts");
  const [reviewing, setReviewing] = useState<string | null>(null);

  const tabs: { id: TabId; label: string }[] = [
    { id: "contracts", label: t("jobInfoContractsTabsContracts") },
    { id: "documents", label: t("jobInfoContractsTabsDocuments") },
    { id: "comments", label: t("jobInfoContractsTabsComments") },
  ];

  async function handleMarkReviewed(contractId: string, documentId: string) {
    setReviewing(`${contractId}-${documentId}`);
    try {
      await onMarkReviewed(contractId, documentId);
    } finally {
      setReviewing(null);
    }
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden h-full flex flex-col">
      {/* Tab list */}
      <div className="border-b flex">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={[
              "flex-1 px-3 py-3 text-xs font-medium border-b-2 transition-colors",
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "contracts" && (
          <ContractsTabContent
            contracts={contracts}
            isLoading={isLoading}
            reviewing={reviewing}
            onMarkReviewed={handleMarkReviewed}
            t={t}
          />
        )}
        {activeTab === "documents" && (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            {t("jobInfoNoDataText")}
          </div>
        )}
        {activeTab === "comments" && (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            {t("jobInfoNoDataText")}
          </div>
        )}
      </div>
    </div>
  );
}

interface ContractsTabContentProps {
  contracts: ContractGroup[];
  isLoading: boolean;
  reviewing: string | null;
  onMarkReviewed: (contractId: string, documentId: string) => Promise<void>;
  t: (key: TranslationKey) => string;
}

function ContractsTabContent({
  contracts,
  isLoading,
  reviewing,
  onMarkReviewed,
  t,
}: ContractsTabContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <svg className="h-4 w-4 animate-spin text-muted-foreground" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">{t("jobInfoNoDataText")}</p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex gap-2">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-amber-600 mt-0.5" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <p className="text-xs font-medium text-amber-800">{t("jobInfoContractsToastTitle")}</p>
          <p className="text-xs text-amber-700 mt-0.5">{t("jobInfoContractsToastMessage")}</p>
        </div>
      </div>

      {/* Contract cards */}
      {contracts.map((contract) => (
        <div key={contract.contractId} className="rounded-lg border bg-background p-4 space-y-3">
          {/* Contract header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{contract.contractType ?? "Contract"}</p>
              {contract.cfaType && (
                <span className="inline-block mt-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {contract.cfaType}
                </span>
              )}
            </div>
            {contract.creditLimit != null && (
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{t("jobInfoTableColumnCreditLimit")}</p>
                <p className="text-sm font-semibold">
                  {new Intl.NumberFormat("th-TH", { style: "decimal", minimumFractionDigits: 2 }).format(
                    contract.creditLimit
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Documents */}
          {contract.documents && contract.documents.length > 0 && (
            <ul className="space-y-1.5">
              {contract.documents.map((doc: ContractDocument) => (
                <li key={doc.documentId} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {doc.reviewed ? (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-green-600 fill-none stroke-current" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-muted-foreground fill-none stroke-current" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    )}
                    {doc.documentUrl ? (
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate"
                        aria-label={`Open document ${doc.documentName ?? doc.documentId}`}
                      >
                        {doc.documentName ?? doc.documentId ?? "Document"}
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground truncate">
                        {doc.documentName ?? doc.documentId ?? "Document"}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Mark as reviewed button */}
          <button
            aria-label={`Mark contract ${contract.contractId} as reviewed`}
            disabled={reviewing !== null}
            onClick={() =>
              onMarkReviewed(
                contract.contractId ?? "",
                contract.documents?.[0]?.documentId ?? ""
              )
            }
            className="w-full rounded-lg border border-primary/30 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5 disabled:opacity-50"
          >
            {reviewing ? "…" : t("jobInfoContractsMarkAsReviewed")}
          </button>
        </div>
      ))}
    </div>
  );
}
