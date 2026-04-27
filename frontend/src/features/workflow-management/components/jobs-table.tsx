"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { StatusBadge } from "@/components/status-badge";
import type { WorkflowJob } from "../types";

interface JobsTableProps {
  jobs: WorkflowJob[];
  isLoading: boolean;
  error: string | null;
}

function ActionMenu({ jobNo }: { jobNo: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        aria-label={`Actions for job ${jobNo}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border bg-card shadow-md">
          {[
            { label: "View Details", action: () => router.push(`/workflow-management/${jobNo}`) },
            { label: "Assign Owner", action: () => setOpen(false) },
            { label: "Mark as Complete", action: () => setOpen(false) },
            { label: "Cancel Job", action: () => setOpen(false) },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={() => { action(); setOpen(false); }}
              className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function JobsTable({ jobs, isLoading, error }: JobsTableProps) {
  const router = useRouter();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        {t("jobInfoNoDataText")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("workflowManagementTableJobNo")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("workflowManagementTableStatus")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("workflowManagementTableApplicantInfo")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("workflowManagementTableCaNo")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("workflowManagementTableSegment")}
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
              {t("workflowManagementTableJobOwner")}
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
              {t("workflowManagementTableTotal")}
            </th>
            <th className="w-10 px-2 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.jobNo}
              className="border-b transition-colors hover:bg-muted/40 cursor-pointer"
              onClick={() => router.push(`/workflow-management/${job.jobNo}`)}
            >
              <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">
                {job.jobNo}
              </td>
              <td className="px-4 py-3">
                <StatusBadge label={job.status} />
              </td>
              <td className="px-4 py-3">{job.applicantName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{job.caNo}</td>
              <td className="px-4 py-3">{job.segment}</td>
              <td className="px-4 py-3">{job.jobOwner}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {job.total.toLocaleString()}
              </td>
              <td className="px-2 py-3">
                <ActionMenu jobNo={job.jobNo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
