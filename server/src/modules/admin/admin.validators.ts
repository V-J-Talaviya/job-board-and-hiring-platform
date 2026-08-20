import { z } from "zod";
import {
  UserRole,
  UserStatus,
  JobStatus,
  JobType,
  ApplicationStatus,
} from "../../shared/types/enums";
import { objectIdSchema } from "../../shared/validators/common.validators";

export const adminDateRangeSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z
    .object({
      period: z.enum(["today", "week", "month"]).optional(),
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .refine((data) => !data.from || !isNaN(Date.parse(data.from)), {
      message: 'Invalid "from" date',
    })
    .refine((data) => !data.to || !isNaN(Date.parse(data.to)), {
      message: 'Invalid "to" date',
    }),
});

export const adminUserListSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    role: z.nativeEnum(UserRole).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    search: z.string().trim().optional(),
  }),
});

export const adminUpdateUserStatusSchema = z.object({
  body: z.object({ status: z.nativeEnum(UserStatus) }),
  query: z.object({}).optional(),
  params: z.object({ id: objectIdSchema }),
});

export const adminJobListSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().trim().optional(),
    status: z.nativeEnum(JobStatus).optional(),
    jobType: z.nativeEnum(JobType).optional(),
    recruiter: objectIdSchema.optional(),
  }),
});

export const adminApplicationListSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    status: z.nativeEnum(ApplicationStatus).optional(),
    job: objectIdSchema.optional(),
    candidate: objectIdSchema.optional(),
    recruiter: objectIdSchema.optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }),
});
