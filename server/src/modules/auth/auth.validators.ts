import { z } from "zod";
import { UserRole } from "../../shared/types/enums";

// Password rule: at least 8 chars, one letter, one number.
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    password: passwordSchema,
    role: z.enum([UserRole.RECRUITER, UserRole.CANDIDATE]),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1, "Password is required"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
