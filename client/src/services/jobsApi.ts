import { apiClient } from "./apiClient";
import { ApiSuccess, Job, Paginated } from "@/types";

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  jobType?: string;
  location?: string;
  skills?: string;
  minimumSalary?: number;
  maximumSalary?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const jobsApi = {
  list: (filters: JobFilters) =>
    apiClient
      .get<Paginated<Job>>("/jobs", { params: filters })
      .then((r) => r.data),

  myJobs: (filters: JobFilters) =>
    apiClient
      .get<Paginated<Job>>("/jobs/my", { params: filters })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient
      .get<ApiSuccess<{ job: Job }>>(`/jobs/${id}`)
      .then((r) => r.data.data.job),

  create: (payload: Partial<Job>) =>
    apiClient
      .post<ApiSuccess<{ job: Job }>>("/jobs", payload)
      .then((r) => r.data.data.job),

  update: (id: string, payload: Partial<Job>) =>
    apiClient
      .patch<ApiSuccess<{ job: Job }>>(`/jobs/${id}`, payload)
      .then((r) => r.data.data.job),

  remove: (id: string) => apiClient.delete(`/jobs/${id}`),

  setStatus: (id: string, status: string) =>
    apiClient
      .patch<ApiSuccess<{ job: Job }>>(`/jobs/${id}/status`, { status })
      .then((r) => r.data.data.job),
};
