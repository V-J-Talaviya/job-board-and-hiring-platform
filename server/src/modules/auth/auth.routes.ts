import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { authRateLimiter } from "../../middleware/rateLimit";
import { registerSchema, loginSchema } from "./auth.validators";
import {
  registerHandler,
  loginHandler,
  meHandler,
  logoutHandler,
} from "./auth.controller";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  registerHandler,
);

router.post("/login", authRateLimiter, validate(loginSchema), loginHandler);

router.get("/me", authenticate, meHandler);

router.post("/logout", authenticate, logoutHandler);

export default router;
