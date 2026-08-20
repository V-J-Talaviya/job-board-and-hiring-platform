import { apiClient } from "./apiClient";
import { ApiSuccess, User } from "@/types";

export const usersApi = {
  updateProfile: (payload: {
    name?: string;
    skills?: string[];
    yearsOfExperience?: number;
  }) =>
    apiClient
      .patch<ApiSuccess<{ user: User }>>("/users/me", payload)
      .then((r) => r.data.data.user),

  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    return apiClient
      .post<ApiSuccess<{ resumeUrl: string; resumeFileName: string }>>(
        "/users/me/resume",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      )
      .then((r) => r.data.data);
  },

  downloadResume: (filename: string) =>
    apiClient.get(`/users/me/resume/${encodeURIComponent(filename)}`, {
      responseType: "blob",
    }),
};
