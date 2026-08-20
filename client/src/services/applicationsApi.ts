import { apiClient } from "./apiClient";
import { ApiSuccess, Application, Paginated } from "@/types";

export const applicationsApi = {
  apply: (jobId: string, coverLetter?: string) =>
    apiClient
      .post<
        ApiSuccess<{ application: Application }>
      >(`/jobs/${jobId}/applications`, { coverLetter })
      .then((r) => r.data.data.application),

  myApplications: (params: { page?: number; limit?: number }) =>
    apiClient
      .get<Paginated<Application>>("/applications/me", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccess<{ application: Application }>>(`/applications/${id}`)
      .then((r) => r.data.data.application),

  forJob: (
    jobId: string,
    params: { page?: number; limit?: number; status?: string },
  ) =>
    apiClient
      .get<Paginated<Application>>(`/jobs/${jobId}/applications`, { params })
      .then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient
      .patch<
        ApiSuccess<{ application: Application }>
      >(`/applications/${id}/status`, { status })
      .then((r) => r.data.data.application),
};
