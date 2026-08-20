import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess, sendPaginated } from "../../shared/utils/apiResponse";
import * as adminService from "./admin.service";

export const adminDashboardHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await adminService.getAdminDashboard(req.query);
    return sendSuccess(res, data);
  },
);

export const listUsersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { users, pagination } = await adminService.listUsers(req.query);
    return sendPaginated(res, users, pagination);
  },
);

export const updateUserStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await adminService.updateUserStatus(
      req.params.id,
      req.body.status,
    );
    const message =
      req.body.status === "SUSPENDED"
        ? "User suspended successfully"
        : "User activated successfully";
    return sendSuccess(res, { user }, message);
  },
);

export const listAllJobsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { jobs, pagination } = await adminService.listAllJobs(req.query);
    return sendPaginated(res, jobs, pagination);
  },
);

export const listAllApplicationsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { applications, pagination } = await adminService.listAllApplications(
      req.query,
    );
    return sendPaginated(res, applications, pagination);
  },
);
