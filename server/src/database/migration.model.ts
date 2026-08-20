import { Schema, model, Document } from "mongoose";

export interface MigrationDocument extends Document {
  name: string;
  executedAt: Date;
}

const migrationSchema = new Schema<MigrationDocument>({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, default: () => new Date() },
});

export const MigrationModel = model<MigrationDocument>(
  "_Migration",
  migrationSchema,
  "_migrations",
);
