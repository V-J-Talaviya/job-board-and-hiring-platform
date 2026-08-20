import { z } from "zod";
import { JobType, JobStatus } from "../../shared/types/enums";
import { objectIdSchema } from "../../shared/validators/common.validators";

export const createJobSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(3).max(150),
      description: z.string().trim().min(10),
      requiredSkills: z
        .array(z.string().trim().min(1))
        .min(1, "At least one skill is required"),
      salaryMin: z.coerce.number().min(0),
      salaryMax: z.coerce.number().min(0),
      currency: z.string().trim().length(3).optional(),
      jobType: z.nativeEnum(JobType),
      location: z.string().trim().min(1),
      applicationDeadline: z.coerce.date(),
    })
    .refine((data) => data.salaryMax >= data.salaryMin, {
      message: "salaryMax must be greater than or equal to salaryMin",
      path: ["salaryMax"],
    })
    .refine((data) => data.applicationDeadline.getTime() > Date.now(), {
      message: "applicationDeadline must be in the future",
      path: ["applicationDeadline"],
    }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateJobSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(3).max(150).optional(),
      description: z.string().trim().min(10).optional(),
      requiredSkills: z.array(z.string().trim().min(1)).min(1).optional(),
      salaryMin: z.coerce.number().min(0).optional(),
      salaryMax: z.coerce.number().min(0).optional(),
      currency: z.string().trim().length(3).optional(),
      jobType: z.nativeEnum(JobType).optional(),
      location: z.string().trim().min(1).optional(),
      applicationDeadline: z.coerce.date().optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({ id: objectIdSchema }),
});

export const updateJobStatusSchema = z.object({
  body: z.object({ status: z.nativeEnum(JobStatus) }),
  query: z.object({}).optional(),
  params: z.object({ id: objectIdSchema }),
});

export const jobIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: objectIdSchema }),
});

export const jobFilterSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().trim().optional(),
    jobType: z.nativeEnum(JobType).optional(),
    location: z.string().trim().optional(),
    skills: z.string().trim().optional(), // comma-separated
    minimumSalary: z.coerce.number().min(0).optional(),
    maximumSalary: z.coerce.number().min(0).optional(),
    status: z.nativeEnum(JobStatus).optional(),
    sortBy: z
      .enum(["createdAt", "salaryMin", "salaryMax", "applicationDeadline"])
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
