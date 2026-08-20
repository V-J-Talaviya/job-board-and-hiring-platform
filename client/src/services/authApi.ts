import { apiClient } from "./apiClient";
import { ApiSuccess, User } from "@/types";

export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: "RECRUITER" | "CANDIDATE";
  }) =>
    apiClient
      .post<
        ApiSuccess<{ user: User; token: string }>
      >("/auth/register", payload)
      .then((r) => r.data.data),

  login: (payload: { email: string; password: string }) =>
    apiClient
      .post<ApiSuccess<{ user: User; token: string }>>("/auth/login", payload)
      .then((r) => r.data.data),

  me: () =>
    apiClient
      .get<ApiSuccess<{ user: User }>>("/auth/me")
      .then((r) => r.data.data.user),

  logout: () => apiClient.post("/auth/logout"),
};
