import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { Job } from "@/types";
import { JOB_TYPE_LABELS } from "@/constants";
import JobStatusBadge from "./JobStatusBadge";
import SalaryDisplay from "./SalaryDisplay";

export default function JobCard({ job }: { job: Job }) {
  const isExpired = new Date(job.applicationDeadline).getTime() < Date.now();

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card block p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{job.title}</h3>
        <JobStatusBadge status={job.status} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {job.location}
        </span>
        <span>{JOB_TYPE_LABELS[job.jobType] ?? job.jobType}</span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {isExpired
            ? "Deadline passed"
            : `Apply by ${new Date(job.applicationDeadline).toLocaleDateString()}`}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.requiredSkills.slice(0, 4).map((skill) => (
          <span key={skill} className="badge bg-brand-50 text-brand-700">
            {skill}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-slate-700">
        <SalaryDisplay job={job} />
      </p>
    </Link>
  );
}
