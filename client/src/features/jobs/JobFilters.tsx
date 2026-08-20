import { JOB_TYPE_LABELS } from "@/constants";
import SearchInput from "@/components/common/SearchInput";

export interface JobFilterState {
  search: string;
  jobType: string;
  location: string;
}

export default function JobFilters({
  filters,
  onChange,
}: {
  filters: JobFilterState;
  onChange: (next: JobFilterState) => void;
}) {
  return (
    <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
      <SearchInput
        value={filters.search}
        onChange={(search) => onChange({ ...filters, search })}
        placeholder="Search by title or keyword"
      />
      <select
        className="input"
        value={filters.jobType}
        onChange={(e) => onChange({ ...filters, jobType: e.target.value })}
        aria-label="Filter by job type"
      >
        <option value="">All job types</option>
        {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input
        className="input"
        value={filters.location}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
        placeholder="Location (e.g. Remote)"
        aria-label="Filter by location"
      />
    </div>
  );
}
