import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../shared/types/enums";
import {
  updateApplicationStatusSchema,
  applicationIdParamSchema,
} from "./application.validators";
import {
  listMyApplicationsHandler,
  getApplicationHandler,
  updateApplicationStatusHandler,
} from "./application.controller";

const router = Router();

router.get(
  "/me",
  authenticate,
  authorize(UserRole.CANDIDATE),
  listMyApplicationsHandler,
);
router.get(
  "/:id",
  authenticate,
  validate(applicationIdParamSchema),
  getApplicationHandler,
);
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.RECRUITER),
  validate(updateApplicationStatusSchema),
  updateApplicationStatusHandler,
);

export default router;
