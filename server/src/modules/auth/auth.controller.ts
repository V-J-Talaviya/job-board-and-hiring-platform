import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import * as authService from "./auth.service";

export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, token } = await authService.register(req.body);
    return sendSuccess(res, { user, token }, "Registered successfully", 201);
  },
);

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    return sendSuccess(res, { user, token }, "Logged in successfully");
  },
);

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  return sendSuccess(res, { user }, "Current user fetched");
});

export const logoutHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    return sendSuccess(res, null, "Logged out successfully");
  },
);
