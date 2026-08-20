import { apiClient } from "./apiClient";
import { ApiSuccess, Application, Job, Paginated, User } from "@/types";

export interface AdminDashboardData {
  totalUsers: number;
  totalRecruiters: number;
  totalCandidates: number;
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplications: number;
  charts: {
    jobsPostedOverTime: { date: string; count: number }[];
    applicationsOverTime: { date: string; count: number }[];
    topRecruiters: {
      recruiterId: string;
      name: string;
      email: string;
      jobsPosted: number;
    }[];
  };
}

export const adminApi = {
  dashboard: (params: { period?: string; from?: string; to?: string }) =>
    apiClient
      .get<ApiSuccess<AdminDashboardData>>("/admin/dashboard", { params })
      .then((r) => r.data.data),

  listUsers: (params: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }) =>
    apiClient
      .get<Paginated<User>>("/admin/users", { params })
      .then((r) => r.data),

  updateUserStatus: (id: string, status: string) =>
    apiClient
      .patch<
        ApiSuccess<{ user: User }>
      >(`/admin/users/${id}/status`, { status })
      .then((r) => r.data.data.user),

  listJobs: (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    jobType?: string;
  }) =>
    apiClient
      .get<Paginated<Job>>("/admin/jobs", { params })
      .then((r) => r.data),

  listApplications: (params: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    apiClient
      .get<Paginated<Application>>("/admin/applications", { params })
      .then((r) => r.data),
};
