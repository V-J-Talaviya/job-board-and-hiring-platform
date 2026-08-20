import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, FileCheck2, Archive } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminApi } from "@/services/adminApi";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";

type Period = "today" | "week" | "month";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>("week");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "dashboard", period],
    queryFn: () => adminApi.dashboard({ period }),
  });

  if (isLoading) return <Spinner label="Loading dashboard..." />;
  if (isError || !data)
    return (
      <ErrorState
        message="Unable to load the admin dashboard."
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin dashboard
        </h1>
        <div className="flex gap-2">
          {(["today", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                period === p
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setPeriod(p)}
            >
              {p === "today"
                ? "Today"
                : p === "week"
                  ? "This week"
                  : "This month"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total users" value={data.totalUsers} icon={Users} />
        <StatCard label="Total jobs" value={data.totalJobs} icon={Briefcase} />
        <StatCard
          label="Open jobs"
          value={data.openJobs}
          icon={FileCheck2}
          accent="text-emerald-600"
        />
        <StatCard
          label="Closed jobs"
          value={data.closedJobs}
          icon={Archive}
          accent="text-slate-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Jobs posted over time">
          {data.charts.jobsPostedOverTime.length === 0 ? (
            <EmptyState title="No data for this range." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.charts.jobsPostedOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2547dd"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Applications over time">
          {data.charts.applicationsOverTime.length === 0 ? (
            <EmptyState title="No data for this range." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.charts.applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#059669"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="card p-5">
        <h3 className="mb-4 font-semibold text-slate-900">Top recruiters</h3>
        {data.charts.topRecruiters.length === 0 ? (
          <EmptyState title="No recruiters yet." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2">Recruiter</th>
                <th className="py-2">Email</th>
                <th className="py-2 text-right">Jobs posted</th>
              </tr>
            </thead>
            <tbody>
              {data.charts.topRecruiters.map((r) => (
                <tr
                  key={r.recruiterId}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-2 font-medium text-slate-900">{r.name}</td>
                  <td className="py-2 text-slate-500">{r.email}</td>
                  <td className="py-2 text-right">{r.jobsPosted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
