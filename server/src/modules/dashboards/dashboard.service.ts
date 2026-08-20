import { Types } from "mongoose";
import { JobModel } from "../jobs/job.model";
import { ApplicationModel } from "../applications/application.model";
import { BookmarkModel } from "../bookmarks/bookmark.model";
import { ActivityLogModel } from "./activityLog.model";
import { JobStatus, ApplicationStatus } from "../../shared/types/enums";

export async function getRecruiterDashboard(recruiterId: string) {
  const recruiterObjectId = new Types.ObjectId(recruiterId);

  const [
    activeJobsCount,
    closedJobsCount,
    applicationStatusCounts,
    recentActivity,
  ] = await Promise.all([
    JobModel.countDocuments({
      recruiterId,
      isDeleted: false,
      status: JobStatus.OPEN,
    }),
    JobModel.countDocuments({
      recruiterId,
      isDeleted: false,
      status: JobStatus.CLOSED,
    }),
    ApplicationModel.aggregate([
      { $match: { recruiterId: recruiterObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    ActivityLogModel.find({ userId: recruiterId })
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const applicationsByStatus: Record<string, number> = {};
  let totalApplicants = 0;
  for (const row of applicationStatusCounts) {
    applicationsByStatus[row._id] = row.count;
    totalApplicants += row.count;
  }

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const applicationsThisWeek = await ApplicationModel.countDocuments({
    recruiterId,
    createdAt: { $gte: oneWeekAgo },
  });

  return {
    activeJobsCount,
    closedJobsCount,
    openJobs: activeJobsCount,
    closedJobs: closedJobsCount,
    totalApplicants,
    applicationsThisWeek,
    applicationsByStatus,
    recentActivity,
  };
}

export async function getCandidateDashboard(candidateId: string) {
  const candidateObjectId = new Types.ObjectId(candidateId);

  const [statusCounts, savedJobsCount] = await Promise.all([
    ApplicationModel.aggregate([
      { $match: { candidateId: candidateObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    BookmarkModel.countDocuments({ candidateId }),
  ]);

  const counts: Record<string, number> = {
    APPLIED: 0,
    SHORTLISTED: 0,
    INTERVIEWED: 0,
    REJECTED: 0,
    HIRED: 0,
  };
  let totalApplications = 0;
  for (const row of statusCounts) {
    counts[row._id] = row.count;
    totalApplications += row.count;
  }

  return {
    totalApplications,
    appliedCount: counts[ApplicationStatus.APPLIED],
    shortlistedCount: counts[ApplicationStatus.SHORTLISTED],
    interviewedCount: counts[ApplicationStatus.INTERVIEWED],
    hiredCount: counts[ApplicationStatus.HIRED],
    rejectedCount: counts[ApplicationStatus.REJECTED],
    savedJobsCount,
  };
}
