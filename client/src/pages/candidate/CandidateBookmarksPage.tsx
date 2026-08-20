import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookmarksApi } from "@/services/bookmarksApi";
import { getApiErrorMessage } from "@/services/apiClient";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import JobCard from "@/features/jobs/JobCard";

export default function CandidateBookmarksPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["bookmarks", page],
    queryFn: () => bookmarksApi.list({ page, limit: 9 }),
  });

  const removeMutation = useMutation({
    mutationFn: (jobId: string) => bookmarksApi.remove(jobId),
    onSuccess: () => {
      toast.success("Bookmark removed");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Saved jobs</h1>

      {isLoading && <Spinner label="Loading saved jobs..." />}
      {isError && (
        <ErrorState
          message="Unable to load saved jobs."
          onRetry={() => refetch()}
        />
      )}
      {data && data.data.length === 0 && (
        <EmptyState
          title="No saved jobs yet."
          message="Bookmark jobs while browsing to see them here."
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((bookmark) => (
              <div key={bookmark._id} className="relative">
                <JobCard job={bookmark.jobId} />
                <button
                  className="btn-secondary absolute right-3 top-3 !px-2 !py-1 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    removeMutation.mutate(bookmark.jobId._id);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
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
