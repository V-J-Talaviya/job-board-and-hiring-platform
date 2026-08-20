import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess, sendPaginated } from "../../shared/utils/apiResponse";
import * as applicationService from "./application.service";

export const applyToJobHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const application = await applicationService.applyToJob(
      req.params.jobId,
      req.user!.userId,
      req.body.coverLetter,
    );
    return sendSuccess(
      res,
      { application },
      "Application submitted successfully",
      201,
    );
  },
);

export const listMyApplicationsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { applications, pagination } =
      await applicationService.listMyApplications(req.user!.userId, req.query);
    return sendPaginated(res, applications, pagination);
  },
);

export const getApplicationHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const application = await applicationService.getApplicationById(
      req.params.id,
      req.user!,
    );
    return sendSuccess(res, { application });
  },
);

export const listApplicationsForJobHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { applications, pagination } =
      await applicationService.listApplicationsForJob(
        req.params.jobId,
        req.user!.userId,
        req.query,
      );
    return sendPaginated(res, applications, pagination);
  },
);

export const updateApplicationStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      req.user!.userId,
      req.body.status,
    );
    return sendSuccess(
      res,
      { application },
      "Application status updated successfully",
    );
  },
);
