import bcrypt from "bcryptjs";
import { UserModel } from "../users/user.model";
import { UserRole, UserStatus } from "../../shared/types/enums";
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from "../../shared/errors/AppError";
import { signToken } from "../../shared/utils/jwt";

const SALT_ROUNDS = 10;

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole.RECRUITER | UserRole.CANDIDATE;
}

export async function register(input: RegisterInput) {
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) {
    throw new ConflictError("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role,
    status: UserStatus.ACTIVE,
  });

  const token = signToken({ userId: user._id.toString(), role: user.role });
  return { user, token };
}

export async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new ForbiddenError(
      "Your account has been suspended. Contact an administrator.",
    );
  }

  const token = signToken({ userId: user._id.toString(), role: user.role });
  return { user, token };
}

export async function getCurrentUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new UnauthorizedError("User no longer exists");
  }
  return user;
}
