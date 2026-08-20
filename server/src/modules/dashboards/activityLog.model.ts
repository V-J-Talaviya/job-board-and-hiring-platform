import { Schema, model, Document, Types } from "mongoose";
import { ActivityType } from "../../shared/types/enums";

export interface ActivityLogDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: ActivityType;
  message: string;
  entityType: "JOB" | "APPLICATION";
  entityId: Types.ObjectId;
  createdAt: Date;
}

const activityLogSchema = new Schema<ActivityLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: Object.values(ActivityType), required: true },
    message: { type: String, required: true },
    entityType: { type: String, enum: ["JOB", "APPLICATION"], required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

activityLogSchema.index({ userId: 1, createdAt: -1 });

export const ActivityLogModel = model<ActivityLogDocument>(
  "ActivityLog",
  activityLogSchema,
);
