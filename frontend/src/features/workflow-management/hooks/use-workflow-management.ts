"use client";

import { useState, useEffect, useCallback } from "react";
import type { WorkflowJob } from "../types";

const WORKFLOW_BASE =
  process.env.NEXT_PUBLIC_WORKFLOW_BASE_URL ?? "http://localhost:8089";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type WorkflowTab = "my" | "tracked" | "team" | "unassigned";

const TAB_PARAM: Record<WorkflowTab, string> = {
  my: "MY_JOBS",
  tracked: "TRACKED",
  team: "TEAM",
  unassigned: "UNASSIGNED",
};

export interface UseWorkflowManagementReturn {
  jobs: WorkflowJob[];
  isLoading: boolean;
  error: string | null;
  activeTab: WorkflowTab;
  setActiveTab: (tab: WorkflowTab) => void;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  refresh: () => void;
}

export function useWorkflowManagement(): UseWorkflowManagementReturn {
  const [jobs, setJobs] = useState<WorkflowJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WorkflowTab>("my");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${WORKFLOW_BASE}/rest/api/v1/backendForFrontends/workflow/jobs?tab=${TAB_PARAM[activeTab]}`,
        { headers: getAuthHeaders() }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setJobs((json?.data?.jobs as WorkflowJob[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load jobs");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    isCreateModalOpen,
    openCreateModal: () => setIsCreateModalOpen(true),
    closeCreateModal: () => setIsCreateModalOpen(false),
    refresh: fetchJobs,
  };
}
