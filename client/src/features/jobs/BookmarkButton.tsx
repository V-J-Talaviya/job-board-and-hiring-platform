import { Bookmark as BookmarkIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookmarksApi } from "@/services/bookmarksApi";
import { getApiErrorMessage } from "@/services/apiClient";

export default function BookmarkButton({
  jobId,
  bookmarked,
}: {
  jobId: string;
  bookmarked: boolean;
}) {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: () => bookmarksApi.add(jobId),
    onSuccess: () => {
      toast.success("Job bookmarked");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const removeMutation = useMutation({
    mutationFn: () => bookmarksApi.remove(jobId),
    onSuccess: () => {
      toast.success("Bookmark removed");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const isPending = addMutation.isPending || removeMutation.isPending;

  return (
    <button
      className="btn-secondary"
      disabled={isPending}
      onClick={() =>
        bookmarked ? removeMutation.mutate() : addMutation.mutate()
      }
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this job"}
    >
      <BookmarkIcon
        className={`h-4 w-4 ${bookmarked ? "fill-brand-600 text-brand-600" : ""}`}
      />
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
