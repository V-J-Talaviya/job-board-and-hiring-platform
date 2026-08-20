import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      skills: z.array(z.string().trim().min(1)).optional(),
      yearsOfExperience: z.coerce.number().min(0).max(60).optional(),
    })
    .strict(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
