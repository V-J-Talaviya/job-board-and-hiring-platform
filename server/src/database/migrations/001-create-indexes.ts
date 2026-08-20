import { UserModel } from "../../modules/users/user.model";
import { JobModel } from "../../modules/jobs/job.model";
import { ApplicationModel } from "../../modules/applications/application.model";
import { BookmarkModel } from "../../modules/bookmarks/bookmark.model";

export const name = "001-create-indexes";

export async function up(): Promise<void> {
  await UserModel.syncIndexes();
  await JobModel.syncIndexes();
  await ApplicationModel.syncIndexes();
  await BookmarkModel.syncIndexes();
}
