import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../shared/types/enums";
import { listBookmarksHandler } from "./bookmark.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(UserRole.CANDIDATE),
  listBookmarksHandler,
);

export default router;
