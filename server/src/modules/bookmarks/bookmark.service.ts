import { BookmarkModel } from "./bookmark.model";
import { JobModel } from "../jobs/job.model";
import { NotFoundError, ConflictError } from "../../shared/errors/AppError";
import { resolvePagination } from "../../shared/utils/pagination";

export async function addBookmark(candidateId: string, jobId: string) {
  const job = await JobModel.findOne({ _id: jobId, isDeleted: false });
  if (!job) throw new NotFoundError("Job not found");

  const existing = await BookmarkModel.findOne({ candidateId, jobId });
  if (existing) throw new ConflictError("Job already bookmarked");

  return BookmarkModel.create({ candidateId, jobId });
}

export async function removeBookmark(candidateId: string, jobId: string) {
  const result = await BookmarkModel.findOneAndDelete({ candidateId, jobId });
  if (!result) throw new NotFoundError("Bookmark not found");
  return result;
}

export async function listBookmarks(
  candidateId: string,
  pageInput: { page?: number; limit?: number },
) {
  const { page, limit, skip } = resolvePagination(pageInput);
  const [bookmarks, total] = await Promise.all([
    BookmarkModel.find({ candidateId })
      .populate("jobId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BookmarkModel.countDocuments({ candidateId }),
  ]);
  return { bookmarks, pagination: { page, limit, total } };
}
