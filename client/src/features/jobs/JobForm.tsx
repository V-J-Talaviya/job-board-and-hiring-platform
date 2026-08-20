import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobFormSchema, JobFormValues } from "@/validations/job.schema";
import { JOB_TYPE_LABELS } from "@/constants";
import { Job } from "@/types";

function toDateInputValue(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export default function JobForm({
  initialJob,
  onSubmit,
  submitLabel = "Post job",
  isSubmitting = false,
}: {
  initialJob?: Job;
  onSubmit: (values: JobFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialJob
      ? {
          title: initialJob.title,
          description: initialJob.description,
          requiredSkills: initialJob.requiredSkills.join(", "),
          salaryMin: initialJob.salaryMin,
          salaryMax: initialJob.salaryMax,
          jobType: initialJob.jobType,
          location: initialJob.location,
          applicationDeadline: toDateInputValue(initialJob.applicationDeadline),
        }
      : { jobType: "FULL_TIME" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="title">
          Job title
        </label>
        <input id="title" className="input" {...register("title")} />
        {errors.title && <p className="error-text">{errors.title.message}</p>}
      </div>

      <div>
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          className="input"
          {...register("description")}
        />
        {errors.description && (
          <p className="error-text">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="requiredSkills">
          Required skills (comma-separated)
        </label>
        <input
          id="requiredSkills"
          className="input"
          placeholder="React, Node.js, MongoDB"
          {...register("requiredSkills")}
        />
        {errors.requiredSkills && (
          <p className="error-text">{errors.requiredSkills.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="salaryMin">
            Minimum salary
          </label>
          <input
            id="salaryMin"
            type="number"
            className="input"
            {...register("salaryMin")}
          />
          {errors.salaryMin && (
            <p className="error-text">{errors.salaryMin.message}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="salaryMax">
            Maximum salary
          </label>
          <input
            id="salaryMax"
            type="number"
            className="input"
            {...register("salaryMax")}
          />
          {errors.salaryMax && (
            <p className="error-text">{errors.salaryMax.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="jobType">
            Job type
          </label>
          <select id="jobType" className="input" {...register("jobType")}>
            {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="location">
            Location
          </label>
          <input id="location" className="input" {...register("location")} />
          {errors.location && (
            <p className="error-text">{errors.location.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="applicationDeadline">
          Application deadline
        </label>
        <input
          id="applicationDeadline"
          type="date"
          className="input"
          {...register("applicationDeadline")}
        />
        {errors.applicationDeadline && (
          <p className="error-text">{errors.applicationDeadline.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
