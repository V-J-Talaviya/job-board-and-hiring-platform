import { FilterQuery } from "mongoose";
import { UserModel, UserDocument } from "../users/user.model";
import { JobModel, JobDocument } from "../jobs/job.model";
import {
  ApplicationModel,
  ApplicationDocument,
} from "../applications/application.model";
import { UserRole, JobStatus } from "../../shared/types/enums";
import { NotFoundError, BadRequestError } from "../../shared/errors/AppError";
import { resolvePagination } from "../../shared/utils/pagination";

interface DateRangeInput {
  period?: "today" | "week" | "month";
  from?: string;
  to?: string;
}

function resolveDateRange(input: DateRangeInput): { start: Date; end: Date } {
  const end = input.to ? new Date(input.to) : new Date();
  if (input.from) {
    return { start: new Date(input.from), end };
  }

  const start = new Date();
  switch (input.period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "week":
    default:
      start.setDate(start.getDate() - 7);
      break;
  }
  return { start, end };
}

export async function getAdminDashboard(input: DateRangeInput) {
  const { start, end } = resolveDateRange(input);
  if (start.getTime() > end.getTime()) {
    throw new BadRequestError('"from" date must be before "to" date');
  }

  const [
    totalUsers,
    totalRecruiters,
    totalCandidates,
    totalJobs,
    openJobs,
    closedJobs,
    totalApplications,
    jobsPostedOverTime,
    applicationsOverTime,
    topRecruiters,
  ] = await Promise.all([
    UserModel.countDocuments({}),
    UserModel.countDocuments({ role: UserRole.RECRUITER }),
    UserModel.countDocuments({ role: UserRole.CANDIDATE }),
    JobModel.countDocuments({ isDeleted: false }),
    JobModel.countDocuments({ isDeleted: false, status: JobStatus.OPEN }),
    JobModel.countDocuments({ isDeleted: false, status: JobStatus.CLOSED }),
    ApplicationModel.countDocuments({}),
    JobModel.aggregate([
      { $match: { isDeleted: false, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    ApplicationModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    JobModel.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$recruiterId", jobsPosted: { $sum: 1 } } },
      { $sort: { jobsPosted: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      {
        $project: {
          _id: 0,
          recruiterId: "$_id",
          name: "$recruiter.name",
          email: "$recruiter.email",
          jobsPosted: 1,
        },
      },
    ]),
  ]);

  return {
    range: { from: start, to: end },
    totalUsers,
    totalRecruiters,
    totalCandidates,
    totalJobs,
    openJobs,
    closedJobs,
    totalApplications,
    charts: {
      jobsPostedOverTime: jobsPostedOverTime.map((r) => ({
        date: r._id,
        count: r.count,
      })),
      applicationsOverTime: applicationsOverTime.map((r) => ({
        date: r._id,
        count: r.count,
      })),
      topRecruiters,
    },
  };
}

export async function listUsers(filters: {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: string;
  search?: string;
}) {
  const { page, limit, skip } = resolvePagination(filters);
  const query: FilterQuery<UserDocument> = {};
  if (filters.role) query.role = filters.role;
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$or = [
      { name: new RegExp(filters.search, "i") },
      { email: new RegExp(filters.search, "i") },
    ];
  }

  const [users, total] = await Promise.all([
    UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(query),
  ]);

  return { users, pagination: { page, limit, total } };
}

export async function updateUserStatus(userId: string, status: string) {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  if (user.role === UserRole.ADMIN) {
    throw new BadRequestError(
      "Admin accounts cannot be suspended through this endpoint",
    );
  }
  user.status = status as UserDocument["status"];
  await user.save();
  return user;
}

export async function listAllJobs(filters: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobType?: string;
  recruiter?: string;
}) {
  const { page, limit, skip } = resolvePagination(filters);
  const query: FilterQuery<JobDocument> = { isDeleted: false };
  if (filters.status) query.status = filters.status;
  if (filters.jobType) query.jobType = filters.jobType;
  if (filters.recruiter) query.recruiterId = filters.recruiter;
  if (filters.search) query.$text = { $search: filters.search };

  const [jobs, total] = await Promise.all([
    JobModel.find(query)
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    JobModel.countDocuments(query),
  ]);

  return { jobs, pagination: { page, limit, total } };
}

export async function listAllApplications(filters: {
  page?: number;
  limit?: number;
  status?: string;
  job?: string;
  candidate?: string;
  recruiter?: string;
  from?: string;
  to?: string;
}) {
  const { page, limit, skip } = resolvePagination(filters);
  const query: FilterQuery<ApplicationDocument> = {};
  if (filters.status) query.status = filters.status;
  if (filters.job) query.jobId = filters.job;
  if (filters.candidate) query.candidateId = filters.candidate;
  if (filters.recruiter) query.recruiterId = filters.recruiter;
  if (filters.from || filters.to) {
    query.createdAt = {
      ...(filters.from ? { $gte: new Date(filters.from) } : {}),
      ...(filters.to ? { $lte: new Date(filters.to) } : {}),
    };
  }

  const [applications, total] = await Promise.all([
    ApplicationModel.find(query)
      .populate("jobId", "title")
      .populate("candidateId", "name email")
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ApplicationModel.countDocuments(query),
  ]);

  return { applications, pagination: { page, limit, total } };
}
