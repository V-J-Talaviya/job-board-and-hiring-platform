import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendSuccess, sendPaginated } from "../../shared/utils/apiResponse";
import * as bookmarkService from "./bookmark.service";

export const addBookmarkHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bookmark = await bookmarkService.addBookmark(
      req.user!.userId,
      req.params.jobId,
    );
    return sendSuccess(res, { bookmark }, "Job bookmarked successfully", 201);
  },
);

export const removeBookmarkHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await bookmarkService.removeBookmark(req.user!.userId, req.params.jobId);
    return sendSuccess(res, null, "Bookmark removed successfully");
  },
);

export const listBookmarksHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { bookmarks, pagination } = await bookmarkService.listBookmarks(
      req.user!.userId,
      req.query,
    );
    return sendPaginated(res, bookmarks, pagination);
  },
);
