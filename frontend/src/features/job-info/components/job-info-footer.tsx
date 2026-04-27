"use client";

import { useLanguage } from "@/contexts/language-context";

interface JobInfoFooterProps {
  onCancel: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function JobInfoFooter({
  onCancel,
  onBack,
  onSubmit,
  isSubmitting,
}: JobInfoFooterProps) {
  const { t } = useLanguage();

  return (
    <div className="sticky bottom-0 z-10 border-t bg-card/95 backdrop-blur-sm px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
        {/* Left: Cancel */}
        <button
          aria-label="Cancel and return"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          {t("jobInfoFooterCancel")}
        </button>

        {/* Right: Back + Submit */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Go back to previous step"
            onClick={onBack}
            className="rounded-lg border bg-muted/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            {t("jobInfoFooterBack")}
          </button>
          <button
            aria-label="Submit job"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : t("jobInfoFooterSubmit")}
          </button>
        </div>
      </div>
    </div>
  );
}
