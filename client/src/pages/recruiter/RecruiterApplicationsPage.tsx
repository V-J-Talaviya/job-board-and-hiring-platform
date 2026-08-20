import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { applicationsApi } from "@/services/applicationsApi";
import { jobsApi } from "@/services/jobsApi";
import { getApiErrorMessage } from "@/services/apiClient";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ApplicationStatusSelect from "@/features/applications/ApplicationStatusSelect";
import { ApplicationStatus, User } from "@/types";
import { Download, FileText } from "lucide-react";
import { usersApi } from "@/services/usersApi";

export default function RecruiterApplicationsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobsApi.getById(jobId!),
    enabled: !!jobId,
  });

  const applicationsQuery = useQuery({
    queryKey: ["applications", "job", jobId, page],
    queryFn: () => applicationsApi.forJob(jobId!, { page, limit: 10 }),
    enabled: !!jobId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationsApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Application status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const handleDownloadResume = async (filename: string) => {
    try {
      const response = await usersApi.downloadResume(filename);

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download resume:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Applications {jobQuery.data ? `for ${jobQuery.data.title}` : ""}
        </h1>
        <p className="text-sm text-slate-500">
          Review candidates and update their status.
        </p>
      </div>

      {applicationsQuery.isLoading && (
        <Spinner label="Loading applications..." />
      )}
      {applicationsQuery.isError && (
        <ErrorState
          message="Unable to load applications."
          onRetry={() => applicationsQuery.refetch()}
        />
      )}
      {applicationsQuery.data && applicationsQuery.data.data.length === 0 && (
        <EmptyState
          title="No applications yet."
          message="Check back once candidates start applying."
        />
      )}

      {applicationsQuery.data && applicationsQuery.data.data.length > 0 && (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Skills</th>
                  <th className="px-4 py-3">Resume</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {applicationsQuery.data.data.map((application) => {
                  const candidate = application.candidateId as User;
                  return (
                    <tr
                      key={application._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {candidate.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {candidate.yearsOfExperience} yrs
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="badge bg-slate-100 text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {application.resumeUrl ? (
                          <button
                            title="Download Resume"
                            className="w-full flex justify-center"
                            onClick={() =>
                              handleDownloadResume(
                                application.resumeUrl.split("/").pop()!,
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="w-full flex justify-center text-slate-500">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <ApplicationStatusSelect
                          value={application.status}
                          disabled={statusMutation.isPending}
                          onChange={(status) =>
                            statusMutation.mutate({
                              id: application._id,
                              status,
                            })
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            page={applicationsQuery.data.pagination.page}
            totalPages={applicationsQuery.data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
