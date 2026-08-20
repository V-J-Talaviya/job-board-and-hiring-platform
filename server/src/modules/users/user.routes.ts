import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { resumeUpload } from "../../middleware/upload";
import { updateProfileSchema } from "./user.validators";
import {
  getMeHandler,
  updateMeHandler,
  uploadResumeHandler,
  downloadResumeHandler,
} from "./user.controller";

const router = Router();

router.get("/me", authenticate, getMeHandler);
router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateMeHandler,
);
router.post(
  "/me/resume",
  authenticate,
  resumeUpload.single("resume"),
  uploadResumeHandler,
);
router.get("/me/resume/:filename", authenticate, downloadResumeHandler);

export default router;
