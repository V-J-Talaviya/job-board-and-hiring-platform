import Badge from "@/components/common/Badge";
import { ApplicationStatus } from "@/types";
import {
  APPLICATION_STATUS_COLORS,
  APPLICATION_STATUS_LABELS,
} from "@/constants";

export default function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  return (
    <Badge className={APPLICATION_STATUS_COLORS[status]}>
      {APPLICATION_STATUS_LABELS[status]}
    </Badge>
  );
}
