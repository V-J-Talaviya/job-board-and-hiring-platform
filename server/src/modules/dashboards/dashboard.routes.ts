import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../shared/types/enums";
import {
  recruiterDashboardHandler,
  candidateDashboardHandler,
} from "./dashboard.controller";

const router = Router();

router.get(
  "/recruiter",
  authenticate,
  authorize(UserRole.RECRUITER),
  recruiterDashboardHandler,
);
router.get(
  "/candidate",
  authenticate,
  authorize(UserRole.CANDIDATE),
  candidateDashboardHandler,
);

export default router;
