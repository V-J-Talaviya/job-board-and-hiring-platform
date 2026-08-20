import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { jobsApi } from "@/services/jobsApi";
import { getApiErrorMessage } from "@/services/apiClient";
import { JobFormValues } from "@/validations/job.schema";
import JobForm from "@/features/jobs/JobForm";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";

export default function RecruiterJobFormPage({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getById(id!),
    enabled: mode === "edit" && !!id,
  });

  function toPayload(values: JobFormValues) {
    return {
      ...values,
      requiredSkills: values.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }

  const createMutation = useMutation({
    mutationFn: (values: JobFormValues) => jobsApi.create(toPayload(values)),
    onSuccess: () => {
      toast.success("Job created successfully.");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate("/recruiter/jobs");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (values: JobFormValues) =>
      jobsApi.update(id!, toPayload(values)),
    onSuccess: () => {
      toast.success("Job updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate("/recruiter/jobs");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (mode === "edit") {
    if (jobQuery.isLoading) return <Spinner label="Loading job..." />;
    if (jobQuery.isError || !jobQuery.data)
      return (
        <ErrorState
          message="Unable to load this job."
          onRetry={() => jobQuery.refetch()}
        />
      );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        {mode === "create" ? "Post a new job" : "Edit job"}
      </h1>
      <JobForm
        initialJob={mode === "edit" ? jobQuery.data : undefined}
        submitLabel={mode === "create" ? "Post job" : "Save changes"}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) =>
          mode === "create"
            ? createMutation.mutate(values)
            : updateMutation.mutate(values)
        }
      />
    </div>
  );
}
