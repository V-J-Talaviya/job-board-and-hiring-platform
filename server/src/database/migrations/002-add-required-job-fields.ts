import { JobModel } from "../../modules/jobs/job.model";

export const name = "002-add-required-job-fields";

export async function up(): Promise<void> {
  await JobModel.updateMany(
    { isDeleted: { $exists: false } },
    { $set: { isDeleted: false } },
  );
}
