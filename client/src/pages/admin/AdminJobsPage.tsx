import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/adminApi";
import { usePagedFilters } from "@/hooks/useDebouncedFilters";
import SearchInput from "@/components/common/SearchInput";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import JobStatusBadge from "@/features/jobs/JobStatusBadge";
import { Job } from "@/types";

interface Filters {
  search: string;
  status: string;
}

export default function AdminJobsPage() {
  const { filters, page, setPage, updateFilters } = usePagedFilters<Filters>({
    search: "",
    status: "",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "jobs", filters, page],
    queryFn: () =>
      adminApi.listJobs({
        page,
        limit: 10,
        search: filters.search || undefined,
        status: filters.status || undefined,
      }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">All jobs</h1>

      <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
        <SearchInput
          value={filters.search}
          onChange={(search) => updateFilters({ ...filters, search })}
          placeholder="Search jobs"
        />
        <select
          className="input"
          value={filters.status}
          onChange={(e) =>
            updateFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {isLoading && <Spinner label="Loading jobs..." />}
      {isError && (
        <ErrorState message="Unable to load jobs." onRetry={() => refetch()} />
      )}
      {data && data.data.length === 0 && <EmptyState title="No jobs found." />}

      {data && data.data.length > 0 && (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Recruiter</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Posted</th>
                  <th className="px-4 py-3">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((job: Job) => {
                  const recruiter =
                    typeof job.recruiterId === "object"
                      ? job.recruiterId
                      : null;
                  return (
                    <tr
                      key={job._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {job.title}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {recruiter?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {job.jobType}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {job.location}
                      </td>
                      <td className="px-4 py-3">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
