"use client";

import { useState, useCallback } from "react";
import type { JobInfoGetResponse, ContractGroup } from "../types";

const JOB_INFO_BASE =
  process.env.NEXT_PUBLIC_JOB_INFO_BASE_URL ?? "http://localhost:8089";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function jobInfoFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${JOB_INFO_BASE}${path}`, {
    ...init,
    headers: { ...getAuthHeaders(), ...(init.headers as Record<string, string> ?? {}) },
  });
}

export interface UseJobInfoReturn {
  jobInfo: JobInfoGetResponse | null;
  contracts: ContractGroup[];
  isLoading: boolean;
  isContractsLoading: boolean;
  error: string | null;
  fetchJobInfo: (jobId: string) => Promise<void>;
  fetchContracts: (jobId: string) => Promise<void>;
  updateJobInfo: (jobId: string, body: Record<string, unknown>) => Promise<void>;
  reviewDocument: (jobId: string, contractId: string, documentId: string, isReviewed: boolean) => Promise<void>;
  submitJob: (jobId: string, comment?: string) => Promise<void>;
  cancelJob: (jobId: string, reason: string) => Promise<void>;
}

export function useJobInfo(): UseJobInfoReturn {
  const [jobInfo, setJobInfo] = useState<JobInfoGetResponse | null>(null);
  const [contracts, setContracts] = useState<ContractGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContractsLoading, setIsContractsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobInfo = useCallback(async (jobId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await jobInfoFetch(
        `/rest/api/v1/backendForFrontends/job-info/${encodeURIComponent(jobId)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setJobInfo((json?.data as JobInfoGetResponse) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load job info");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchContracts = useCallback(async (jobId: string) => {
    setIsContractsLoading(true);
    try {
      const res = await jobInfoFetch(
        `/rest/api/v1/backendForFrontends/job-info/${encodeURIComponent(jobId)}/contracts`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setContracts((json?.data?.contracts as ContractGroup[]) ?? []);
    } catch {
      setContracts([]);
    } finally {
      setIsContractsLoading(false);
    }
  }, []);

  const updateJobInfo = useCallback(
    async (jobId: string, body: Record<string, unknown>) => {
      const res = await jobInfoFetch(
        `/rest/api/v1/backendForFrontends/job-info/${encodeURIComponent(jobId)}`,
        { method: "PUT", body: JSON.stringify(body) }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setJobInfo((json?.data as JobInfoGetResponse) ?? null);
    },
    []
  );

  const reviewDocument = useCallback(
    async (jobId: string, contractId: string, documentId: string, isReviewed: boolean) => {
      const res = await jobInfoFetch(
        `/rest/api/v1/backendForFrontends/job-info/${encodeURIComponent(jobId)}/contracts/${encodeURIComponent(contractId)}/review`,
        { method: "PATCH", body: JSON.stringify({ isReviewed, documentId }) }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    },
    []
  );

  const submitJob = useCallback(async (jobId: string, comment?: string) => {
    const res = await jobInfoFetch(
      `/rest/api/v1/backendForFrontends/job-info/${encodeURIComponent(jobId)}/submit`,
      { method: "POST", body: JSON.stringify({ comment }) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }, []);

  const cancelJob = useCallback(async (jobId: string, reason: string) => {
    const res = await jobInfoFetch(
      `/rest/api/v1/backendForFrontends/job-info/${encodeURIComponent(jobId)}/cancel`,
      { method: "POST", body: JSON.stringify({ reason }) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }, []);

  return {
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
  };
}
