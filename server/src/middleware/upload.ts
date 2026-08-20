import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { MAX_RESUME_SIZE_MB, UPLOAD_DIR } from "../config/env";
import { BadRequestError } from "../shared/errors/AppError";

const uploadDir = path.resolve(process.cwd(), UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}-${Date.now()}${ext}`;
    cb(null, safeName);
  },
});

function fileFilter(
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new BadRequestError("Only PDF, DOC, and DOCX files are allowed"));
  }
  cb(null, true);
}

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: Number(MAX_RESUME_SIZE_MB) * 1024 * 1024 },
});

export const resumesDir = uploadDir;
