import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../shared/types/enums";
import {
  addBookmarkHandler,
  removeBookmarkHandler,
} from "./bookmark.controller";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  authorize(UserRole.CANDIDATE),
  addBookmarkHandler,
);
router.delete(
  "/",
  authenticate,
  authorize(UserRole.CANDIDATE),
  removeBookmarkHandler,
);

export default router;
