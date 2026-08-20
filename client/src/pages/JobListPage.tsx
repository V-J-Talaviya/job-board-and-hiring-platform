import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/services/jobsApi";
import JobCard from "@/features/jobs/JobCard";
import JobFilters, { JobFilterState } from "@/features/jobs/JobFilters";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Pagination from "@/components/common/Pagination";
import { usePagedFilters } from "@/hooks/useDebouncedFilters";

export default function JobListPage() {
  const { filters, page, setPage, updateFilters } =
    usePagedFilters<JobFilterState>({
      search: "",
      jobType: "",
      location: "",
    });

  const jobsQuery = useQuery({
    queryKey: ["jobs", filters, page],
    queryFn: () =>
      jobsApi.list({
        page,
        limit: 9,
        search: filters.search || undefined,
        jobType: filters.jobType || undefined,
        location: filters.location || undefined,
      }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Browse jobs</h1>
        <p className="text-sm text-slate-500">
          Search open positions across every recruiter on the platform.
        </p>
      </div>

      <JobFilters filters={filters} onChange={updateFilters} />

      {jobsQuery.isLoading && <Spinner label="Loading jobs..." />}
      {jobsQuery.isError && (
        <ErrorState
          message="Unable to load jobs."
          onRetry={() => jobsQuery.refetch()}
        />
      )}
      {jobsQuery.data && jobsQuery.data.data.length === 0 && (
        <EmptyState
          title="No jobs found."
          message="Try changing your filters."
        />
      )}

      {jobsQuery.data && jobsQuery.data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobsQuery.data.data.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
          <Pagination
            page={jobsQuery.data.pagination.page}
            totalPages={jobsQuery.data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
