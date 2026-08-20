import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../config/env";
import { UserRole } from "../types/enums";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
