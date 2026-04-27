export interface WorkflowJob {
  jobNo: string;
  status: string;
  applicantName: string;
  cifNo: string;
  caNo: string;
  segment: string;
  jobOwner: string;
  total: number;
}

export interface CreateJobFormValues {
  applicantName: string;
  cifNo: string;
  caNo: string;
  segment: string;
  referenceNo: string;
}
