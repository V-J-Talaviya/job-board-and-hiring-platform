import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import * as dashboardService from "./dashboard.service";

export const recruiterDashboardHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await dashboardService.getRecruiterDashboard(req.user!.userId);
    return sendSuccess(res, data);
  },
);

export const candidateDashboardHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await dashboardService.getCandidateDashboard(req.user!.userId);
    return sendSuccess(res, data);
  },
);
