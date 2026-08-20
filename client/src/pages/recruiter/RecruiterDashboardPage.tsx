import { useQuery } from "@tanstack/react-query";
import { Briefcase, Archive, Users, TrendingUp } from "lucide-react";
import { dashboardApi } from "@/services/dashboardApi";
import StatCard from "@/components/common/StatCard";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";

export default function RecruiterDashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard", "recruiter"],
    queryFn: dashboardApi.recruiter,
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
      <h1 className="text-2xl font-semibold text-slate-900">
        Recruiter dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active jobs"
          value={data.activeJobsCount}
          icon={Briefcase}
        />
        <StatCard
          label="Closed jobs"
          value={data.closedJobsCount}
          icon={Archive}
          accent="text-slate-500"
        />
        <StatCard
          label="Total applicants"
          value={data.totalApplicants}
          icon={Users}
          accent="text-blue-600"
        />
        <StatCard
          label="Applications this week"
          value={data.applicationsThisWeek}
          icon={TrendingUp}
          accent="text-emerald-600"
        />
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-slate-900">Recent activity</h2>
        {data.recentActivity.length === 0 ? (
          <EmptyState title="No recent activity yet." />
        ) : (
          <ul className="space-y-3">
            {data.recentActivity.map((activity) => (
              <li
                key={activity._id}
                className="flex justify-between border-b border-slate-100 pb-2 text-sm last:border-0"
              >
                <span className="text-slate-700">{activity.message}</span>
                <span className="text-slate-400">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
