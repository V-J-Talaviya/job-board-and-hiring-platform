import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../shared/types/enums";
import {
  applyJobSchema,
  jobApplicationsParamSchema,
} from "./application.validators";
import {
  applyToJobHandler,
  listApplicationsForJobHandler,
} from "./application.controller";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(applyJobSchema),
  applyToJobHandler,
);
router.get(
  "/",
  authenticate,
  authorize(UserRole.RECRUITER),
  validate(jobApplicationsParamSchema),
  listApplicationsForJobHandler,
);

export default router;
