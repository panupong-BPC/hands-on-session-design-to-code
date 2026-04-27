"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { StatusBadge } from "@/components/status-badge";

interface JobInfoHeaderProps {
  jobId: string;
  tags: string[];
  onViewChanges: () => void;
  onSaveChanges: () => void;
  isSaving: boolean;
}

export function JobInfoHeader({
  jobId,
  tags,
  onViewChanges,
  onSaveChanges,
  isSaving,
}: JobInfoHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <Link
        href="/workflow-management"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Back to Workflow Management"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {t("jobInfoNavBackToWorkflow")}
      </Link>

      {/* Title row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">{t("jobInfoHeaderJobDetails")}</h1>
            {/* Job ID chip */}
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-mono font-medium text-muted-foreground border">
              {jobId}
            </span>
          </div>

          {/* Status badges */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <StatusBadge key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onViewChanges}
            aria-label="View changes history"
            className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            {t("jobInfoHeaderViewChanges")}
          </button>
          <button
            onClick={onSaveChanges}
            disabled={isSaving}
            aria-label="Save changes"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSaving ? "Saving…" : t("jobInfoHeaderSaveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
