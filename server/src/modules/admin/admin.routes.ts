import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../shared/types/enums";
import {
  adminDateRangeSchema,
  adminUserListSchema,
  adminUpdateUserStatusSchema,
  adminJobListSchema,
  adminApplicationListSchema,
} from "./admin.validators";
import {
  adminDashboardHandler,
  listUsersHandler,
  updateUserStatusHandler,
  listAllJobsHandler,
  listAllApplicationsHandler,
} from "./admin.controller";

const router = Router();
router.use(authenticate, authorize(UserRole.ADMIN));

router.get("/dashboard", validate(adminDateRangeSchema), adminDashboardHandler);
router.get("/users", validate(adminUserListSchema), listUsersHandler);
router.patch(
  "/users/:id/status",
  validate(adminUpdateUserStatusSchema),
  updateUserStatusHandler,
);
router.get("/jobs", validate(adminJobListSchema), listAllJobsHandler);
router.get(
  "/applications",
  validate(adminApplicationListSchema),
  listAllApplicationsHandler,
);

export default router;
