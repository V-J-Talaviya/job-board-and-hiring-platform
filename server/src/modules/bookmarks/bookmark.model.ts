import { Schema, model, Document, Types } from "mongoose";

export interface BookmarkDocument extends Document {
  _id: Types.ObjectId;
  candidateId: Types.ObjectId;
  jobId: Types.ObjectId;
  createdAt: Date;
}

const bookmarkSchema = new Schema<BookmarkDocument>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

bookmarkSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export const BookmarkModel = model<BookmarkDocument>(
  "Bookmark",
  bookmarkSchema,
);
