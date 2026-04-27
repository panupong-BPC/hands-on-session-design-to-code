"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/language-context";
import type { CreateJobFormValues } from "../types";

const schema = z.object({
  applicantName: z.string().min(1, "Applicant name is required"),
  cifNo: z
    .string()
    .length(10, "CIF No. must be exactly 10 digits")
    .regex(/^\d{10}$/, "CIF No. must contain digits only"),
  caNo: z.string().min(1, "CA No. is required"),
  segment: z.string().min(1, "Segment is required"),
  referenceNo: z.string().optional().default(""),
});

const SEGMENTS = ["SME", "Corporate", "Retail", "Private Banking"];

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { applicantName: "", cifNo: "", caNo: "", segment: "", referenceNo: "" },
  });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(_data: CreateJobFormValues) {
    // Submit to workflow service when API is available
    onSuccess?.();
    handleClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-job-modal-title"
    >
      <div className="w-full max-w-md rounded-xl bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 id="create-job-modal-title" className="text-base font-semibold">
            {t("workflowManagementNavCreateNewJob")}
          </h2>
          <button
            aria-label="Close modal"
            onClick={handleClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Applicant Name */}
          <div>
            <label htmlFor="applicantName" className="block text-sm font-medium mb-1">
              Applicant Name <span className="text-red-500">*</span>
            </label>
            <input
              id="applicantName"
              aria-label="Applicant Name"
              {...register("applicantName")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.applicantName && (
              <p className="mt-1 text-xs text-red-600">{errors.applicantName.message}</p>
            )}
          </div>

          {/* CIF No. */}
          <div>
            <label htmlFor="cifNo" className="block text-sm font-medium mb-1">
              CIF No. <span className="text-red-500">*</span>
            </label>
            <input
              id="cifNo"
              aria-label="CIF No."
              maxLength={10}
              {...register("cifNo")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.cifNo && (
              <p className="mt-1 text-xs text-red-600">{errors.cifNo.message}</p>
            )}
          </div>

          {/* CA No. */}
          <div>
            <label htmlFor="caNo" className="block text-sm font-medium mb-1">
              CA No. <span className="text-red-500">*</span>
            </label>
            <input
              id="caNo"
              aria-label="CA No."
              {...register("caNo")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.caNo && (
              <p className="mt-1 text-xs text-red-600">{errors.caNo.message}</p>
            )}
          </div>

          {/* Segment */}
          <div>
            <label htmlFor="segment" className="block text-sm font-medium mb-1">
              Segment <span className="text-red-500">*</span>
            </label>
            <select
              id="segment"
              aria-label="Segment"
              {...register("segment")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select segment</option>
              {SEGMENTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.segment && (
              <p className="mt-1 text-xs text-red-600">{errors.segment.message}</p>
            )}
          </div>

          {/* Reference No. (optional) */}
          <div>
            <label htmlFor="referenceNo" className="block text-sm font-medium mb-1">
              Reference No. <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <input
              id="referenceNo"
              aria-label="Reference No."
              {...register("referenceNo")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              {t("jobInfoFooterCancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="Create new job"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Creating…" : t("workflowManagementNavCreateNewJob")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
