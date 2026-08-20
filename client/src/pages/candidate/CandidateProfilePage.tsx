import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "@/services/usersApi";
import { authApi } from "@/services/authApi";
import { getApiErrorMessage } from "@/services/apiClient";
import { useAuth } from "@/app/providers/AuthProvider";
import FileUpload from "@/components/common/FileUpload";
import Spinner from "@/components/common/Spinner";

export default function CandidateProfilePage() {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name ?? "");
  const [skills, setSkills] = useState(user?.skills.join(", ") ?? "");
  const [yearsOfExperience, setYearsOfExperience] = useState(
    user?.yearsOfExperience ?? 0,
  );

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    initialData: user ?? undefined,
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      usersApi.updateProfile({
        name,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        yearsOfExperience: Number(yearsOfExperience),
      }),
    onSuccess: (updatedUser) => {
      toast.success("Profile updated successfully.");
      setUser(updatedUser);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const resumeMutation = useMutation({
    mutationFn: (file: File) => usersApi.uploadResume(file),
    onSuccess: () => {
      toast.success("Resume uploaded successfully.");
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (!meQuery.data) return <Spinner label="Loading profile..." />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>

      <div className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            className="input bg-slate-50"
            value={meQuery.data.email}
            disabled
          />
        </div>
        <div>
          <label className="label" htmlFor="skills">
            Skills (comma-separated)
          </label>
          <input
            id="skills"
            className="input"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="experience">
            Years of experience
          </label>
          <input
            id="experience"
            type="number"
            min={0}
            className="input"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(Number(e.target.value))}
          />
        </div>
        <button
          className="btn-primary"
          disabled={updateMutation.isPending}
          onClick={() => updateMutation.mutate()}
        >
          {updateMutation.isPending ? "Saving..." : "Save profile"}
        </button>
      </div>

      <div className="card p-6">
        <h2 className="mb-3 font-semibold text-slate-900">Resume</h2>
        <FileUpload
          currentFileName={meQuery.data.resumeFileName}
          onFileSelected={(file) => resumeMutation.mutate(file)}
        />
      </div>
    </div>
  );
}
