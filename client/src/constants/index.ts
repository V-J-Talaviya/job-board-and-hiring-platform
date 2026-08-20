export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  INTERVIEWED: "Interviewed",
  REJECTED: "Rejected",
  HIRED: "Hired",
};

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  APPLIED: "bg-slate-100 text-slate-700",
  SHORTLISTED: "bg-blue-100 text-blue-700",
  INTERVIEWED: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
  HIRED: "bg-emerald-100 text-emerald-700",
};

export const APPLICATION_STATUS_FLOW: string[] = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEWED",
  "HIRED",
];
