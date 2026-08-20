import fs from "fs";
import path from "path";
import { UserModel } from "./user.model";
import { NotFoundError } from "../../shared/errors/AppError";
import { resumesDir } from "../../middleware/upload";

interface ProfileUpdate {
  name?: string;
  skills?: string[];
  yearsOfExperience?: number;
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const user = await UserModel.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new NotFoundError("User not found");
  return user;
}

export async function saveResume(userId: string, file: Express.Multer.File) {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  if (user.resumeFileName) {
    const previousPath = path.join(resumesDir, user.resumeFileName);
    fs.unlink(previousPath, () => {
      // ignore missing file
    });
  }

  user.resumeFileName = file.filename;
  user.resumeUrl = `/api/v1/users/me/resume/${file.filename}`;
  await user.save();
  return user;
}
