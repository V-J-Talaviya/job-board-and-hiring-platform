import { apiClient } from "./apiClient";
import { ApiSuccess } from "@/types";

export interface RecruiterDashboard {
  activeJobsCount: number;
  closedJobsCount: number;
  totalApplicants: number;
  applicationsThisWeek: number;
  applicationsByStatus: Record<string, number>;
  recentActivity: {
    _id: string;
    message: string;
    createdAt: string;
    type: string;
  }[];
}

export interface CandidateDashboard {
  totalApplications: number;
  appliedCount: number;
  shortlistedCount: number;
  interviewedCount: number;
  hiredCount: number;
  rejectedCount: number;
  savedJobsCount: number;
}

export const dashboardApi = {
  recruiter: () =>
    apiClient
      .get<ApiSuccess<RecruiterDashboard>>("/dashboard/recruiter")
      .then((r) => r.data.data),
  candidate: () =>
    apiClient
      .get<ApiSuccess<CandidateDashboard>>("/dashboard/candidate")
      .then((r) => r.data.data),
};
