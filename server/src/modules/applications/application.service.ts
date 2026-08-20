import { ApplicationModel } from "./application.model";
import { JobModel } from "../jobs/job.model";
import { UserModel } from "../users/user.model";
import { ActivityLogModel } from "../dashboards/activityLog.model";
import {
  ActivityType,
  ApplicationStatus,
  JobStatus,
} from "../../shared/types/enums";
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  BadRequestError,
} from "../../shared/errors/AppError";
import { resolvePagination } from "../../shared/utils/pagination";

export async function applyToJob(
  jobId: string,
  candidateId: string,
  coverLetter?: string,
) {
  const job = await JobModel.findOne({ _id: jobId, isDeleted: false });
  if (!job) throw new NotFoundError("Job not found");

  if (job.status !== JobStatus.OPEN) {
    throw new BadRequestError("This job is no longer accepting applications");
  }
  if (job.applicationDeadline.getTime() < Date.now()) {
    throw new BadRequestError(
      "The application deadline for this job has passed",
    );
  }

  const candidate = await UserModel.findById(candidateId);
  if (!candidate) throw new NotFoundError("Candidate not found");

  const existing = await ApplicationModel.findOne({ jobId, candidateId });
  if (existing) {
    throw new ConflictError("You have already applied to this job");
  }

  const application = await ApplicationModel.create({
    jobId: job._id,
    candidateId,
    recruiterId: job.recruiterId,
    coverLetter: coverLetter ?? "",
    resumeUrl: candidate.resumeUrl ?? "",
    status: ApplicationStatus.APPLIED,
  });

  await ActivityLogModel.create({
    userId: job.recruiterId,
    type: ActivityType.APPLICATION_RECEIVED,
    message: `${candidate.name} applied for ${job.title}`,
    entityType: "APPLICATION",
    entityId: application._id,
  });

  return application;
}

export async function listMyApplications(
  candidateId: string,
  pageInput: { page?: number; limit?: number },
) {
  const { page, limit, skip } = resolvePagination(pageInput);
  const [applications, total] = await Promise.all([
    ApplicationModel.find({ candidateId })
      .populate("jobId", "title location jobType status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ApplicationModel.countDocuments({ candidateId }),
  ]);
  return { applications, pagination: { page, limit, total } };
}

export async function getApplicationById(
  id: string,
  requester: { userId: string; role: string },
) {
  const application = await ApplicationModel.findById(id)
    .populate("jobId", "title location jobType")
    .populate("candidateId", "name email skills yearsOfExperience resumeUrl");
  if (!application) throw new NotFoundError("Application not found");

  const isOwner = application.candidateId._id.toString() === requester.userId;
  const isRecruiter = application.recruiterId.toString() === requester.userId;
  const isAdmin = requester.role === "ADMIN";
  if (!isOwner && !isRecruiter && !isAdmin) {
    throw new ForbiddenError("You do not have access to this application");
  }

  return application;
}

export async function listApplicationsForJob(
  jobId: string,
  recruiterId: string,
  filters: { page?: number; limit?: number; status?: ApplicationStatus },
) {
  const job = await JobModel.findOne({ _id: jobId, isDeleted: false });
  if (!job) throw new NotFoundError("Job not found");
  if (job.recruiterId.toString() !== recruiterId) {
    throw new ForbiddenError("You do not own this job");
  }

  const { page, limit, skip } = resolvePagination(filters);
  const query: Record<string, unknown> = { jobId };
  if (filters.status) query.status = filters.status;

  const [applications, total] = await Promise.all([
    ApplicationModel.find(query)
      .populate("candidateId", "name email skills yearsOfExperience resumeUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ApplicationModel.countDocuments(query),
  ]);

  return { applications, pagination: { page, limit, total } };
}

const ACTIVITY_BY_STATUS: Partial<Record<ApplicationStatus, ActivityType>> = {
  [ApplicationStatus.SHORTLISTED]: ActivityType.APPLICATION_SHORTLISTED,
  [ApplicationStatus.INTERVIEWED]: ActivityType.APPLICATION_INTERVIEWED,
  [ApplicationStatus.REJECTED]: ActivityType.APPLICATION_REJECTED,
  [ApplicationStatus.HIRED]: ActivityType.APPLICATION_HIRED,
};

export async function updateApplicationStatus(
  id: string,
  recruiterId: string,
  status: ApplicationStatus,
) {
  const application = await ApplicationModel.findById(id)
    .populate("candidateId", "name")
    .populate("jobId", "title");
  if (!application) throw new NotFoundError("Application not found");
  if (application.recruiterId.toString() !== recruiterId) {
    throw new ForbiddenError(
      "You do not own the job this application belongs to",
    );
  }

  application.status = status;
  await application.save();

  const activityType = ACTIVITY_BY_STATUS[status];
  if (activityType) {
    const candidateName = (
      application.candidateId as unknown as { name: string }
    ).name;
    const jobTitle = (application.jobId as unknown as { title: string }).title;
    await ActivityLogModel.create({
      userId: recruiterId,
      type: activityType,
      message: `${candidateName} was ${status.toLowerCase()} for ${jobTitle}`,
      entityType: "APPLICATION",
      entityId: application._id,
    });
  }

  return application;
}
