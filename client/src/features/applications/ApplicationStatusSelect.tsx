import { ApplicationStatus } from "@/types";
import { APPLICATION_STATUS_LABELS } from "@/constants";

const ALL_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEWED",
  "REJECTED",
  "HIRED",
];

export default function ApplicationStatusSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      className="input"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as ApplicationStatus)}
      aria-label="Update application status"
    >
      {ALL_STATUSES.map((status) => (
        <option key={status} value={status}>
          {APPLICATION_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
