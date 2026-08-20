import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MapPin, Clock, DollarSign } from "lucide-react";
import { jobsApi } from "@/services/jobsApi";
import { applicationsApi } from "@/services/applicationsApi";
import { bookmarksApi } from "@/services/bookmarksApi";
import { useAuth } from "@/app/providers/AuthProvider";
import { getApiErrorMessage } from "@/services/apiClient";
import { JOB_TYPE_LABELS } from "@/constants";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import JobStatusBadge from "@/features/jobs/JobStatusBadge";
import SalaryDisplay from "@/features/jobs/SalaryDisplay";
import BookmarkButton from "@/features/jobs/BookmarkButton";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [coverLetter, setCoverLetter] = useState("");

  const jobQuery = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getById(id!),
    enabled: !!id,
  });

  const bookmarksQuery = useQuery({
    queryKey: ["bookmarks", "all"],
    queryFn: () => bookmarksApi.list({ limit: 100 }),
    enabled: user?.role === "CANDIDATE",
  });

  const myApplicationsQuery = useQuery({
    queryKey: ["applications", "me", "all"],
    queryFn: () => applicationsApi.myApplications({ limit: 100 }),
    enabled: user?.role === "CANDIDATE",
  });

  const applyMutation = useMutation({
    mutationFn: () => applicationsApi.apply(id!, coverLetter || undefined),
    onSuccess: () => {
      toast.success("Application submitted successfully.");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (jobQuery.isLoading) return <Spinner full label="Loading job..." />;
  if (jobQuery.isError || !jobQuery.data)
    return (
      <ErrorState
        message="Unable to load this job."
        onRetry={() => jobQuery.refetch()}
      />
    );

  const job = jobQuery.data;
  const recruiter =
    typeof job.recruiterId === "object" ? job.recruiterId : null;
  const isExpired = new Date(job.applicationDeadline).getTime() < Date.now();
  const alreadyApplied = (myApplicationsQuery.data?.data ?? []).some((app) => {
    const jobId = typeof app.jobId === "object" ? app.jobId._id : app.jobId;
    return jobId === job._id;
  });
  const isBookmarked = (bookmarksQuery.data?.data ?? []).some(
    (b) => b.jobId._id === job._id,
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {job.title}
            </h1>
            {recruiter && (
              <p className="text-sm text-slate-500">
                Posted by {recruiter.name}
              </p>
            )}
          </div>
          <JobStatusBadge status={job.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {job.location}
          </span>
          <span>{JOB_TYPE_LABELS[job.jobType] ?? job.jobType}</span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            <SalaryDisplay job={job} />
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> Apply by{" "}
            {new Date(job.applicationDeadline).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.requiredSkills.map((skill) => (
            <span key={skill} className="badge bg-brand-50 text-brand-700">
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {job.description}
        </p>

        {user?.role === "CANDIDATE" && (
          <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
            {job.status === "CLOSED" ? (
              <p className="badge bg-slate-200 text-slate-600">
                Applications Closed
              </p>
            ) : isExpired ? (
              <p className="badge bg-amber-100 text-amber-700">
                Application Deadline Passed
              </p>
            ) : alreadyApplied ? (
              <p className="badge bg-emerald-100 text-emerald-700">
                Already Applied
              </p>
            ) : (
              <>
                <label className="label" htmlFor="coverLetter">
                  Cover letter (optional)
                </label>
                <textarea
                  id="coverLetter"
                  className="input"
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the recruiter why you're a great fit..."
                />
                <div className="flex gap-3">
                  <button
                    className="btn-primary"
                    disabled={applyMutation.isPending}
                    onClick={() => applyMutation.mutate()}
                  >
                    {applyMutation.isPending ? "Submitting..." : "Apply"}
                  </button>
                  <BookmarkButton jobId={job._id} bookmarked={isBookmarked} />
                </div>
              </>
            )}
          </div>
        )}

        {!user && (
          <div className="mt-6 border-t border-slate-200 pt-6 text-sm text-slate-500">
            <a
              href="/login"
              className="font-medium text-brand-600 hover:underline"
            >
              Log in
            </a>{" "}
            as a candidate to apply for this role.
          </div>
        )}
      </div>
    </div>
  );
}
