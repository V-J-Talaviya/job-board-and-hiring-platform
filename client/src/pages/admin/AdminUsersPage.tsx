import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApi } from "@/services/adminApi";
import { getApiErrorMessage } from "@/services/apiClient";
import { usePagedFilters } from "@/hooks/useDebouncedFilters";
import SearchInput from "@/components/common/SearchInput";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Badge from "@/components/common/Badge";
import { User } from "@/types";

interface Filters {
  search: string;
  role: string;
  status: string;
}

export default function AdminUsersPage() {
  const { filters, page, setPage, updateFilters } = usePagedFilters<Filters>({
    search: "",
    role: "",
    status: "",
  });
  const [userPendingAction, setUserPendingAction] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "users", filters, page],
    queryFn: () =>
      adminApi.listUsers({
        page,
        limit: 10,
        search: filters.search || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
      }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateUserStatus(id, status),
    onSuccess: (_data, variables) => {
      toast.success(
        variables.status === "SUSPENDED"
          ? "User suspended successfully."
          : "User activated successfully.",
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setUserPendingAction(null);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Users</h1>

      <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
        <SearchInput
          value={filters.search}
          onChange={(search) => updateFilters({ ...filters, search })}
          placeholder="Search by name or email"
        />
        <select
          className="input"
          value={filters.role}
          onChange={(e) => updateFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All roles</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="CANDIDATE">Candidate</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          className="input"
          value={filters.status}
          onChange={(e) =>
            updateFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {isLoading && <Spinner label="Loading users..." />}
      {isError && (
        <ErrorState message="Unable to load users." onRetry={() => refetch()} />
      )}
      {data && data.data.length === 0 && (
        <EmptyState
          title="No users found."
          message="Try adjusting your filters."
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge className="bg-slate-100 text-slate-700">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          user.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.role !== "ADMIN" && (
                        <button
                          className="btn-secondary"
                          onClick={() => setUserPendingAction(user)}
                        >
                          {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={!!userPendingAction}
        title={
          userPendingAction?.status === "ACTIVE"
            ? "Suspend user"
            : "Activate user"
        }
        message={`Are you sure you want to ${userPendingAction?.status === "ACTIVE" ? "suspend" : "activate"} ${userPendingAction?.name}?`}
        confirmLabel={
          userPendingAction?.status === "ACTIVE" ? "Suspend" : "Activate"
        }
        danger={userPendingAction?.status === "ACTIVE"}
        onConfirm={() =>
          userPendingAction &&
          statusMutation.mutate({
            id: userPendingAction._id,
            status:
              userPendingAction.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
          })
        }
        onCancel={() => setUserPendingAction(null)}
      />
    </div>
  );
}
