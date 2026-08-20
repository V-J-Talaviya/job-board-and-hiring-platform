import { z } from "zod";
import { ApplicationStatus } from "../../shared/types/enums";
import { objectIdSchema } from "../../shared/validators/common.validators";

export const applyJobSchema = z.object({
  body: z.object({
    coverLetter: z.string().trim().max(5000).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ jobId: objectIdSchema }),
});

export const updateApplicationStatusSchema = z.object({
  body: z.object({ status: z.nativeEnum(ApplicationStatus) }),
  query: z.object({}).optional(),
  params: z.object({ id: objectIdSchema }),
});

export const applicationIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: objectIdSchema }),
});

export const jobApplicationsParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ jobId: objectIdSchema }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    status: z.nativeEnum(ApplicationStatus).optional(),
  }),
});
