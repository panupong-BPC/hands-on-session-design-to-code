import { JobInfoPage } from "@/features/job-info";

interface JobInfoRouteProps {
  params: Promise<{ jobId: string }>;
}

export default async function JobInfoRoute({ params }: JobInfoRouteProps) {
  const { jobId } = await params;
  return <JobInfoPage jobId={jobId} />;
}
