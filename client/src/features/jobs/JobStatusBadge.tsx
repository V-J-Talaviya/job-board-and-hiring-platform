import Badge from "@/components/common/Badge";
import { JobStatus } from "@/types";

export default function JobStatusBadge({ status }: { status: JobStatus }) {
  const color =
    status === "OPEN"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-200 text-slate-600";
  return (
    <Badge className={color}>{status === "OPEN" ? "Open" : "Closed"}</Badge>
  );
}
