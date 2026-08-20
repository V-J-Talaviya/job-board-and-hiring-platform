import { Schema, model, Document, Types } from "mongoose";
import { JobStatus, JobType } from "../../shared/types/enums";

export interface JobDocument extends Document {
  _id: Types.ObjectId;
  recruiterId: Types.ObjectId;
  title: string;
  description: string;
  requiredSkills: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobType: JobType;
  location: string;
  applicationDeadline: Date;
  status: JobStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<JobDocument>(
  {
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true },
    requiredSkills: {
      type: [String],
      required: true,
      validate: (v: string[]) => v.length > 0,
    },
    salaryMin: { type: Number, required: true, min: 0 },
    salaryMax: {
      type: Number,
      required: true,
      validate: {
        validator: function (this: JobDocument, value: number) {
          return value >= this.salaryMin;
        },
        message: "salaryMax must be greater than or equal to salaryMin",
      },
    },
    currency: { type: String, default: "USD" },
    jobType: { type: String, enum: Object.values(JobType), required: true },
    location: { type: String, required: true, trim: true },
    applicationDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

jobSchema.index({ recruiterId: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ title: "text", description: "text" });

export const JobModel = model<JobDocument>("Job", jobSchema);
