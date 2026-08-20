import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { applicationsApi } from "@/services/applicationsApi";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ApplicationTracker from "@/features/applications/ApplicationTracker";
import { Job } from "@/types";

export default function CandidateApplicationsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["applications", "me", page],
    queryFn: () => applicationsApi.myApplications({ page, limit: 10 }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">My applications</h1>

      {isLoading && <Spinner label="Loading your applications..." />}
      {isError && (
        <ErrorState
          message="Unable to load your applications."
          onRetry={() => refetch()}
        />
      )}
      {data && data.data.length === 0 && (
        <EmptyState
          title="No applications yet."
          message="Browse open jobs and apply to get started."
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-3">
            {data.data.map((application) => {
              const job = application.jobId as Job;
              return (
                <div key={application._id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="font-medium text-slate-900 hover:text-brand-600"
                    >
                      {job.title}
                    </Link>
                    <span className="text-xs text-slate-400">
                      Applied{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3">
                    <ApplicationTracker status={application.status} />
                  </div>
                </div>
              );
            })}
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
