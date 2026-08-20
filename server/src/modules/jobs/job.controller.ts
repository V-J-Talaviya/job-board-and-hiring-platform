import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess, sendPaginated } from "../../shared/utils/apiResponse";
import * as jobService from "./job.service";
import { UserRole } from "../../shared/types/enums";

export const createJobHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await jobService.createJob(req.user!.userId, req.body);
    return sendSuccess(res, { job }, "Job created successfully", 201);
  },
);

export const listJobsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const includeAll = req.user?.role === UserRole.ADMIN;
    const { jobs, pagination } = await jobService.listJobs({
      ...req.query,
      includeAll,
    });
    return sendPaginated(res, jobs, pagination);
  },
);

export const getJobHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await jobService.getJobById(req.params.id);
    return sendSuccess(res, { job });
  },
);

export const listMyJobsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { jobs, pagination } = await jobService.listMyJobs(
      req.user!.userId,
      req.query,
    );
    return sendPaginated(res, jobs, pagination);
  },
);

export const updateJobHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await jobService.updateJob(
      req.params.id,
      req.user!.userId,
      req.body,
    );
    return sendSuccess(res, { job }, "Job updated successfully");
  },
);

export const deleteJobHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await jobService.deleteJob(req.params.id, req.user!.userId);
    return sendSuccess(res, null, "Job deleted successfully");
  },
);

export const setJobStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await jobService.setJobStatus(
      req.params.id,
      req.user!.userId,
      req.body.status,
    );
    return sendSuccess(res, { job }, "Job status updated successfully");
  },
);
