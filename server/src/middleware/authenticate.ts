import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../shared/utils/jwt";
import { UnauthorizedError, ForbiddenError } from "../shared/errors/AppError";
import { UserModel } from "../modules/users/user.model";
import { UserStatus } from "../shared/types/enums";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing or invalid authorization header");
    }

    const token = header.slice("Bearer ".length);
    const payload = verifyToken(token);

    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError("User no longer exists");
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenError("Your account has been suspended");
    }

    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (err) {
    if (err instanceof ForbiddenError || err instanceof UnauthorizedError) {
      next(err);
    } else {
      next(new UnauthorizedError("Invalid or expired token"));
    }
  }
}
