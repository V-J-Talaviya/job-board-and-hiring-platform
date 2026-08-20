import { FilterQuery } from "mongoose";
import { JobModel, JobDocument } from "./job.model";
import { NotFoundError, ForbiddenError } from "../../shared/errors/AppError";
import { JobStatus } from "../../shared/types/enums";
import { resolvePagination } from "../../shared/utils/pagination";
import { ActivityLogModel } from "../dashboards/activityLog.model";
import { ActivityType } from "../../shared/types/enums";

interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  jobType?: string;
  location?: string;
  skills?: string;
  minimumSalary?: number;
  maximumSalary?: number;
  status?: JobStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeAll?: boolean;
}

export async function createJob(
  recruiterId: string,
  data: Partial<JobDocument>,
) {
  const job = await JobModel.create({ ...data, recruiterId });
  await ActivityLogModel.create({
    userId: recruiterId,
    type: ActivityType.JOB_CREATED,
    message: `Job posted: ${job.title}`,
    entityType: "JOB",
    entityId: job._id,
  });
  return job;
}

export async function listJobs(filters: JobFilters) {
  const { page, limit, skip } = resolvePagination(filters);
  const query: FilterQuery<JobDocument> = { isDeleted: false };

  if (!filters.includeAll) {
    query.status = JobStatus.OPEN;
    query.applicationDeadline = { $gte: new Date() };
  } else if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  if (filters.jobType) query.jobType = filters.jobType;
  if (filters.location) query.location = new RegExp(filters.location, "i");
  if (filters.skills) {
    const skillList = filters.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillList.length)
      query.requiredSkills = {
        $in: skillList.map((s) => new RegExp(`^${s}$`, "i")),
      };
  }
  if (filters.minimumSalary || filters.maximumSalary) {
    query.salaryMax = {
      ...(filters.minimumSalary ? { $gte: filters.minimumSalary } : {}),
    };
    if (filters.maximumSalary)
      query.salaryMin = { $lte: filters.maximumSalary };
  }

  const sortField = filters.sortBy || "createdAt";
  const sortDir = filters.sortOrder === "asc" ? 1 : -1;

  const [jobs, total] = await Promise.all([
    JobModel.find(query)
      .populate("recruiterId", "name email")
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit),
    JobModel.countDocuments(query),
  ]);

  return { jobs, pagination: { page, limit, total } };
}

export async function getJobById(id: string) {
  const job = await JobModel.findOne({ _id: id, isDeleted: false }).populate(
    "recruiterId",
    "name email",
  );
  if (!job) throw new NotFoundError("Job not found");
  return job;
}

export async function listMyJobs(recruiterId: string, filters: JobFilters) {
  const { page, limit, skip } = resolvePagination(filters);
  const query: FilterQuery<JobDocument> = { recruiterId, isDeleted: false };
  if (filters.status) query.status = filters.status;

  const [jobs, total] = await Promise.all([
    JobModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    JobModel.countDocuments(query),
  ]);

  return { jobs, pagination: { page, limit, total } };
}

async function assertOwnership(
  jobId: string,
  recruiterId: string,
): Promise<JobDocument> {
  const job = await JobModel.findOne({ _id: jobId, isDeleted: false });
  if (!job) throw new NotFoundError("Job not found");
  if (job.recruiterId.toString() !== recruiterId) {
    throw new ForbiddenError("You do not own this job");
  }
  return job;
}

export async function updateJob(
  jobId: string,
  recruiterId: string,
  updates: Partial<JobDocument>,
) {
  const job = await assertOwnership(jobId, recruiterId);
  Object.assign(job, updates);
  await job.save();
  await ActivityLogModel.create({
    userId: recruiterId,
    type: ActivityType.JOB_UPDATED,
    message: `Job updated: ${job.title}`,
    entityType: "JOB",
    entityId: job._id,
  });
  return job;
}

export async function deleteJob(jobId: string, recruiterId: string) {
  const job = await assertOwnership(jobId, recruiterId);
  job.isDeleted = true;
  job.deletedAt = new Date();
  await job.save();
  return job;
}

export async function setJobStatus(
  jobId: string,
  recruiterId: string,
  status: JobStatus,
) {
  const job = await assertOwnership(jobId, recruiterId);
  job.status = status;
  await job.save();
  await ActivityLogModel.create({
    userId: recruiterId,
    type:
      status === JobStatus.CLOSED
        ? ActivityType.JOB_CLOSED
        : ActivityType.JOB_REOPENED,
    message: `Job ${status === JobStatus.CLOSED ? "closed" : "reopened"}: ${job.title}`,
    entityType: "JOB",
    entityId: job._id,
  });
  return job;
}
