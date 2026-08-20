import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Star,
  Users,
  CheckCircle2,
  XCircle,
  Bookmark,
} from "lucide-react";
import { dashboardApi } from "@/services/dashboardApi";
import StatCard from "@/components/common/StatCard";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

export default function CandidateDashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard", "candidate"],
    queryFn: dashboardApi.candidate,
  });

  if (isLoading) return <Spinner label="Loading dashboard..." />;
  if (isError || !data)
    return (
      <ErrorState
        message="Unable to load your dashboard."
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Your dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total applications"
          value={data.totalApplications}
          icon={FileText}
        />
        <StatCard
          label="Shortlisted"
          value={data.shortlistedCount}
          icon={Star}
          accent="text-blue-600"
        />
        <StatCard
          label="Interviewed"
          value={data.interviewedCount}
          icon={Users}
          accent="text-amber-600"
        />
        <StatCard
          label="Hired"
          value={data.hiredCount}
          icon={CheckCircle2}
          accent="text-emerald-600"
        />
        <StatCard
          label="Rejected"
          value={data.rejectedCount}
          icon={XCircle}
          accent="text-red-600"
        />
        <StatCard
          label="Saved jobs"
          value={data.savedJobsCount}
          icon={Bookmark}
          accent="text-purple-600"
        />
      </div>
    </div>
  );
}
