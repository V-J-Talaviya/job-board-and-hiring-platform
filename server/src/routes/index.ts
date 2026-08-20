import { Router } from "express";
import { isDatabaseConnected } from "../config/database";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import jobRoutes from "../modules/jobs/job.routes";
import applicationRoutes from "../modules/applications/application.routes";
import bookmarkRoutes from "../modules/bookmarks/bookmark.routes";
import dashboardRoutes from "../modules/dashboards/dashboard.routes";
import adminRoutes from "../modules/admin/admin.routes";

const router = Router();

router.get("/health", (_req, res) => {
  const dbConnected = isDatabaseConnected();
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    data: {
      status: dbConnected ? "healthy" : "degraded",
      database: dbConnected ? "connected" : "disconnected",
    },
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);

export default router;
