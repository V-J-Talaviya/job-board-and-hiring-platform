import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Users, Lock, Unlock } from "lucide-react";
import { jobsApi } from "@/services/jobsApi";
import { getApiErrorMessage } from "@/services/apiClient";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import JobStatusBadge from "@/features/jobs/JobStatusBadge";
import { Job } from "@/types";

export default function RecruiterJobsPage() {
  const [page, setPage] = useState(1);
  const [jobPendingDelete, setJobPendingDelete] = useState<Job | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["jobs", "my", page],
    queryFn: () => jobsApi.myJobs({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobsApi.remove(id),
    onSuccess: () => {
      toast.success("Job deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setJobPendingDelete(null);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      jobsApi.setStatus(id, status),
    onSuccess: () => {
      toast.success("Job status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          My job postings
        </h1>
        <Link to="/recruiter/jobs/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Post a job
        </Link>
      </div>

      {isLoading && <Spinner label="Loading your jobs..." />}
      {isError && (
        <ErrorState
          message="Unable to load your jobs."
          onRetry={() => refetch()}
        />
      )}
      {data && data.data.length === 0 && (
        <EmptyState
          title="You haven't posted any jobs yet."
          message="Create your first job posting to start receiving applications."
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((job) => (
                  <tr
                    key={job._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {job.title}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{job.jobType}</td>
                    <td className="px-4 py-3 text-slate-500">{job.location}</td>
                    <td className="px-4 py-3">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/recruiter/jobs/${job._id}/applications`}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
                          aria-label="View applications"
                          title="View applications"
                        >
                          <Users className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
                          aria-label="Edit job"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
                          onClick={() =>
                            statusMutation.mutate({
                              id: job._id,
                              status: job.status === "OPEN" ? "CLOSED" : "OPEN",
                            })
                          }
                          aria-label={
                            job.status === "OPEN" ? "Close job" : "Reopen job"
                          }
                          title={job.status === "OPEN" ? "Close" : "Reopen"}
                        >
                          {job.status === "OPEN" ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          className="rounded p-1.5 text-red-500 hover:bg-red-50"
                          onClick={() => setJobPendingDelete(job)}
                          aria-label="Delete job"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      <ConfirmDialog
        open={!!jobPendingDelete}
        title="Delete job posting"
        message={`Are you sure you want to delete "${jobPendingDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={() =>
          jobPendingDelete && deleteMutation.mutate(jobPendingDelete._id)
        }
        onCancel={() => setJobPendingDelete(null)}
      />
    </div>
  );
}
