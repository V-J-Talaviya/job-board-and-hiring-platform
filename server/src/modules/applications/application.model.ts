import { Schema, model, Document, Types } from "mongoose";
import { ApplicationStatus } from "../../shared/types/enums";

export interface ApplicationDocument extends Document {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  candidateId: Types.ObjectId;
  recruiterId: Types.ObjectId;
  coverLetter: string;
  resumeUrl: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<ApplicationDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, default: "" },
    resumeUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
    },
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ recruiterId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

export const ApplicationModel = model<ApplicationDocument>(
  "Application",
  applicationSchema,
);
