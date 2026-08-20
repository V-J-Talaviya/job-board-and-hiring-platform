import { z } from 'zod';

export const jobFormSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters'),
    description: z.string().trim().min(10, 'Description must be at least 10 characters'),
    requiredSkills: z.string().trim().min(1, 'List at least one skill'),
    salaryMin: z.coerce.number().min(0, 'Must be 0 or more'),
    salaryMax: z.coerce.number().min(0, 'Must be 0 or more'),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
    location: z.string().trim().min(1, 'Location is required'),
    applicationDeadline: z.string().min(1, 'Deadline is required'),
  })
  .refine((data) => data.salaryMax >= data.salaryMin, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salaryMax'],
  });

export type JobFormValues = z.infer<typeof jobFormSchema>;
