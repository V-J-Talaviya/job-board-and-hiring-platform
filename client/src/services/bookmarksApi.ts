import { apiClient } from "./apiClient";
import { Bookmark, Paginated } from "@/types";

export const bookmarksApi = {
  list: (params: { page?: number; limit?: number }) =>
    apiClient
      .get<Paginated<Bookmark>>("/bookmarks", { params })
      .then((r) => r.data),

  add: (jobId: string) => apiClient.post(`/jobs/${jobId}/bookmark`),

  remove: (jobId: string) => apiClient.delete(`/jobs/${jobId}/bookmark`),
};
