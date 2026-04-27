"use client";

import { useLanguage } from "@/contexts/language-context";
import type { TranslationKey } from "@/lib/data";
import { JobsTable } from "./components/jobs-table";
import { CreateJobModal } from "./components/create-job-modal";
import { LoanApprovalEngineWidget } from "./components/loan-approval-engine-widget";
import { CreditInsightsWidget } from "./components/credit-insights-widget";
import { QuickStats } from "./components/quick-stats";
import {
  useWorkflowManagement,
  type WorkflowTab,
} from "./hooks/use-workflow-management";

const TABS: { id: WorkflowTab; labelKey: TranslationKey }[] = [
  { id: "my", labelKey: "workflowManagementTabsMyJobs" },
  { id: "tracked", labelKey: "workflowManagementTabsTrackedJobs" },
  { id: "team", labelKey: "workflowManagementTabsTeamsJobs" },
  { id: "unassigned", labelKey: "workflowManagementTabsUnassignedJobs" },
];

export function WorkflowManagementPage() {
  const { t } = useLanguage();
  const {
    jobs,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    refresh,
  } = useWorkflowManagement();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl font-bold sm:text-2xl">{t("workflowManagementTitle")}</h1>
          <button
            aria-label="Create new job"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 self-start sm:self-auto"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t("workflowManagementNavCreateNewJob")}
          </button>
        </div>

        {/* Main layout: table + right sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: tabs + table */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex gap-1 overflow-x-auto">
                {TABS.map(({ id, labelKey }) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={activeTab === id}
                    onClick={() => setActiveTab(id)}
                    className={[
                      "whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                      activeTab === id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                    ].join(" ")}
                  >
                    {t(labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Table card */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <JobsTable jobs={jobs} isLoading={isLoading} error={error} />
            </div>
          </div>

          {/* Right: widgets */}
          <div className="space-y-5">
            <LoanApprovalEngineWidget />
            <CreditInsightsWidget />
            <QuickStats />
          </div>
        </div>
      </div>

      {/* Create job modal */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={refresh}
      />
    </div>
  );
}
