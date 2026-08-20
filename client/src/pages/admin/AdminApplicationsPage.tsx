import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/adminApi";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ApplicationStatusBadge from "@/features/applications/ApplicationStatusBadge";
import { Job, User } from "@/types";

export default function AdminApplicationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "applications", status, page],
    queryFn: () =>
      adminApi.listApplications({
        page,
        limit: 10,
        status: status || undefined,
      }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">
        All applications
      </h1>

      <div className="card p-4">
        <select
          className="input max-w-xs"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="INTERVIEWED">Interviewed</option>
          <option value="REJECTED">Rejected</option>
          <option value="HIRED">Hired</option>
        </select>
      </div>

      {isLoading && <Spinner label="Loading applications..." />}
      {isError && (
        <ErrorState
          message="Unable to load applications."
          onRetry={() => refetch()}
        />
      )}
      {data && data.data.length === 0 && (
        <EmptyState title="No applications found." />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Recruiter</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((application) => {
                  const candidate = application.candidateId as User;
                  const job = application.jobId as Job;
                  const recruiter = application.recruiterId as unknown as User;
                  return (
                    <tr
                      key={application._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {candidate?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {job?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {recruiter?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <ApplicationStatusBadge status={application.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(application.createdAt).toLocaleDateString()}
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
