export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type JobStatus = "OPEN" | "CLOSED";
export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "REMOTE";
export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEWED"
  | "REJECTED"
  | "HIRED";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  skills: string[];
  yearsOfExperience: number;
  resumeUrl?: string;
  resumeFileName?: string;
  createdAt: string;
}

export interface Job {
  _id: string;
  recruiterId: { _id: string; name: string; email: string } | string;
  title: string;
  description: string;
  requiredSkills: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobType: JobType;
  location: string;
  applicationDeadline: string;
  status: JobStatus;
  createdAt: string;
}

export interface Application {
  _id: string;
  jobId: Job | string;
  candidateId:
    | {
        _id: string;
        name: string;
        email: string;
        skills: string[];
        yearsOfExperience: number;
        resumeUrl?: string;
      }
    | string;
  recruiterId: string;
  coverLetter: string;
  resumeUrl: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Bookmark {
  _id: string;
  jobId: Job;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}
