import { Response } from 'express';

export function sendSuccess(res: Response, data: unknown, message = 'Operation successful', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendPaginated(
  res: Response,
  data: unknown[],
  pagination: { page: number; limit: number; total: number },
) {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.max(1, Math.ceil(pagination.total / pagination.limit)),
    },
  });
}

export function sendError(res: Response, message: string, statusCode = 500, errors: unknown[] = []) {
  return res.status(statusCode).json({ success: false, message, errors });
}
