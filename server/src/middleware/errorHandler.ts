import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { isProduction } from "../config/env";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      console.error(`[error] ${req.method} ${req.originalUrl}`, err);
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details ?? [],
    });
  }

  if (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: number }).code === 11000
  ) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
      errors: [],
    });
  }

  console.error(
    `[error] Unhandled error on ${req.method} ${req.originalUrl}`,
    err,
  );

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
    errors: isProduction
      ? []
      : [String(err instanceof Error ? err.stack : err)],
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    errors: [],
  });
}
