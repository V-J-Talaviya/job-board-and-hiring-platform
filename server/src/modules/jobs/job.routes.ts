import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../shared/types/enums";
import {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
  jobIdParamSchema,
  jobFilterSchema,
} from "./job.validators";
import {
  createJobHandler,
  listJobsHandler,
  getJobHandler,
  listMyJobsHandler,
  updateJobHandler,
  deleteJobHandler,
  setJobStatusHandler,
} from "./job.controller";
import applicationRouterForJob from "../applications/application.routesForJob";
import bookmarkRouterForJob from "../bookmarks/bookmark.routesForJob";

const router = Router();

function optionalAuth(
  req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction,
) {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}

router.get("/", optionalAuth, validate(jobFilterSchema), listJobsHandler);
router.get(
  "/my",
  authenticate,
  authorize(UserRole.RECRUITER),
  validate(jobFilterSchema),
  listMyJobsHandler,
);
router.post(
  "/",
  authenticate,
  authorize(UserRole.RECRUITER),
  validate(createJobSchema),
  createJobHandler,
);
router.get("/:id", validate(jobIdParamSchema), getJobHandler);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.RECRUITER),
  validate(updateJobSchema),
  updateJobHandler,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.RECRUITER),
  validate(jobIdParamSchema),
  deleteJobHandler,
);
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.RECRUITER),
  validate(updateJobStatusSchema),
  setJobStatusHandler,
);

router.use("/:jobId/applications", applicationRouterForJob);
router.use("/:jobId/bookmark", bookmarkRouterForJob);

export default router;
