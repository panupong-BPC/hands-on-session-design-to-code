-- Migration: Add workflow-list columns to JOBS table
-- These columns support the GET /workflow/jobs list endpoint used by the Workflow Management page.

ALTER TABLE "JOBS"
    ADD COLUMN IF NOT EXISTS "CA_NO"      VARCHAR(50),
    ADD COLUMN IF NOT EXISTS "SEGMENT"    VARCHAR(100),
    ADD COLUMN IF NOT EXISTS "JOB_OWNER"  VARCHAR(200),
    ADD COLUMN IF NOT EXISTS "TOTAL"      NUMERIC(18,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "TAB_TYPE"   VARCHAR(50)   NOT NULL DEFAULT 'MY_JOBS';

CREATE INDEX IF NOT EXISTS idx_jobs_tab_type ON "JOBS" ("TAB_TYPE");
