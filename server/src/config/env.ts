import dotenv from "dotenv";
dotenv.config();

export const {
  NODE_ENV = "development",
  PORT,
  MONGODB_URI,
  JWT_SECRET = "",
  JWT_EXPIRES_IN = "1d",
  CLIENT_URL = "http://localhost:5173",
  UPLOAD_DIR = "uploads/resumes",
  MAX_RESUME_SIZE_MB = 5,
  ADMIN_NAME,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} = process.env;

export const isProduction = NODE_ENV === "production";
