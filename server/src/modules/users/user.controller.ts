import { Request, Response } from "express";
import path from "path";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";
import { UserModel } from "./user.model";
import * as userService from "./user.service";
import { resumesDir } from "../../middleware/upload";

export const getMeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user!.userId);
    if (!user) throw new NotFoundError("User not found");
    return sendSuccess(res, { user });
  },
);

export const updateMeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    return sendSuccess(res, { user }, "Profile updated successfully");
  },
);

export const uploadResumeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("No resume file was uploaded");
    }
    const user = await userService.saveResume(req.user!.userId, req.file);
    return sendSuccess(
      res,
      { resumeUrl: user.resumeUrl, resumeFileName: user.resumeFileName },
      "Resume uploaded successfully",
    );
  },
);

export const downloadResumeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { filename } = req.params;

    const safeName = path.basename(filename);
    const filePath = path.join(resumesDir, safeName);
    return res.download(filePath);
  },
);
