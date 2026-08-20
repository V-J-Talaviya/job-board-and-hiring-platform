import { Schema, model, Document, Types } from "mongoose";
import { UserRole, UserStatus } from "../../shared/types/enums";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  skills: string[];
  yearsOfExperience: number;
  resumeUrl?: string;
  resumeFileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), required: true },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    skills: { type: [String], default: [] },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    resumeUrl: { type: String, default: "" },
    resumeFileName: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

export const UserModel = model<UserDocument>("User", userSchema);
