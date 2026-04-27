"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useJobInfo } from "./hooks/use-job-info";
import { JobInfoHeader } from "./components/job-info-header";
import { InfoSection } from "./components/info-section";
import { LoanApplicantsTable } from "./components/loan-applicants-table";
import { LoanDetailsTable } from "./components/loan-details-table";
import { CollateralTable } from "./components/collateral-table";
import { ContractTabsPanel } from "./components/contract-tabs-panel";
import { JobInfoFooter } from "./components/job-info-footer";

interface FieldRowProps {
  label: string;
  value: string | number | null | undefined;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium">{value ?? "—"}</p>
    </div>
  );
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("th-TH", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(value);
}

interface JobInfoPageProps {
  jobId: string;
}

export function JobInfoPage({ jobId }: JobInfoPageProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    jobInfo,
    contracts,
    isLoading,
    isContractsLoading,
    error,
    fetchJobInfo,
    fetchContracts,
    updateJobInfo,
    reviewDocument,
    submitJob,
    cancelJob,
  } = useJobInfo();

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void fetchJobInfo(jobId);
    void fetchContracts(jobId);
  }, [jobId, fetchJobInfo, fetchContracts]);

  async function handleSaveChanges() {
    setIsSaving(true);
    try {
      await updateJobInfo(jobId, {});
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await submitJob(jobId);
      router.push("/workflow-management");
    } catch {
      setIsSubmitting(false);
    }
  }

  async function handleCancel() {
    try {
      await cancelJob(jobId, "User cancelled");
    } finally {
      router.push("/workflow-management");
    }
  }

  async function handleMarkReviewed(contractId: string, documentId: string) {
    await reviewDocument(jobId, contractId, documentId, true);
    void fetchContracts(jobId);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {t("jobInfoLoadingText")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 max-w-md text-center">
          {t("jobInfoErrorText")}
        </div>
      </div>
    );
  }

  const tags = jobInfo?.tags ?? [];
  const branch = jobInfo?.branch?.join(", ") ?? "—";
  const applicants = jobInfo?.loanApplicants?.items ?? [];
  const loanDetails = jobInfo?.loanDetails ?? [];
  const collateralItems = jobInfo?.collateralInfo ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 pb-24">
          {/* Page header */}
          <div className="mb-6">
            <JobInfoHeader
              jobId={jobId}
              tags={tags}
              onViewChanges={() => {}}
              onSaveChanges={handleSaveChanges}
              isSaving={isSaving}
            />
          </div>

          {/* Main grid: sections + contracts panel */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
            {/* Left: collapsible sections */}
            <div className="space-y-5 min-w-0">
              {/* 1. General Information */}
              <InfoSection
                title={t("jobInfoSectionGeneralInformation")}
                actionSlot={
                  <button
                    aria-label="Edit general information"
                    className="text-xs text-primary hover:underline"
                  >
                    {t("jobInfoActionEdit")}
                  </button>
                }
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldRow label={t("jobInfoFieldBranch")} value={branch} />
                  <FieldRow
                    label={t("jobInfoFieldLoanAgreementSigningDate")}
                    value={formatDate(jobInfo?.loanAgreementSigningDate)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldSpouseConsentSigningDate")}
                    value={formatDate(jobInfo?.spouseConsentSigningDate)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldGuaranteeSigningDate")}
                    value={formatDate(jobInfo?.guaranteeSigningDate)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldMortgageDate")}
                    value={formatDate(jobInfo?.mortgageDate)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldAppraisalPrice")}
                    value={formatCurrency(jobInfo?.appraisalPrice)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldSellingPrice")}
                    value={formatCurrency(jobInfo?.sellingPrice)}
                  />
                </div>
              </InfoSection>

              {/* 2. Overall Information */}
              <InfoSection title={t("jobInfoSectionOverallInformation")}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Total Applicants", value: applicants.length },
                    { label: "Loan Products", value: loanDetails.length },
                    { label: "Collateral Items", value: collateralItems.length },
                    { label: "Contracts", value: contracts.length },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-muted/50 p-3">
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </InfoSection>

              {/* 3. Credit Facility Agreement Info */}
              <InfoSection title={t("jobInfoSectionCfaInformation")}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldRow
                    label={t("jobInfoFieldCfaTotalCreditLimitOriginal")}
                    value={formatCurrency(jobInfo?.cfaTotalCreditLimitOriginal)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldCfaTotalCreditLimitCurrent")}
                    value={formatCurrency(jobInfo?.cfaTotalCreditLimitCurrent)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldCfaIncrementAmount")}
                    value={formatCurrency(jobInfo?.cfaIncrementAmount)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldCfaSigningDate")}
                    value={formatDate(jobInfo?.cfaSigningDate)}
                  />
                  <FieldRow
                    label={t("jobInfoFieldCfaRound")}
                    value={jobInfo?.cfaRound?.toString()}
                  />
                </div>
              </InfoSection>

              {/* 4. Loan Applicants */}
              <InfoSection title={t("jobInfoSectionLoanApplicants")}>
                <LoanApplicantsTable applicants={applicants} />
              </InfoSection>

              {/* 5. Loan Details */}
              <InfoSection title={t("jobInfoSectionLoanDetails")}>
                <LoanDetailsTable loanDetails={loanDetails} />
              </InfoSection>

              {/* 6. Collateral Information */}
              <InfoSection title={t("jobInfoSectionCollateralInformation")}>
                <CollateralTable items={collateralItems} />
              </InfoSection>
            </div>

            {/* Right: Contract tabs panel */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <ContractTabsPanel
                contracts={contracts}
                isLoading={isContractsLoading}
                onMarkReviewed={handleMarkReviewed}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <JobInfoFooter
        onCancel={handleCancel}
        onBack={() => router.back()}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
