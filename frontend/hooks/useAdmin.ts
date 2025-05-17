import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

/* Users Management */
const getAllUsers = (): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.get("/admin/users"));
};

const updateUserRole = ({ userId, role }: { userId: string; role: Role }): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.patch("/admin/users/role", { userId, role }));
};

const deleteUser = (userId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.delete(`/admin/users/${userId}`));
};

/* Companies Management */
const getAllCompanies = (): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.get("/admin/companies"));
};

const updateCompany = ({ companyId, updateData }: { companyId: string; updateData: any }): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.patch(`/admin/companies/${companyId}`, updateData));
};

const deleteCompany = (companyId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.delete(`/admin/companies/${companyId}`));
};

/* System Statistics */
const getSystemStats = (): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.get("/admin/stats"));
};

/* Query Hooks */
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useGetAllCompanies = () => {
  return useQuery({
    queryKey: ["admin", "companies"],
    queryFn: getAllCompanies,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
  });
};

export const useGetSystemStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getSystemStats,
    staleTime: 1 * 60 * 1000, // 1 minute cache for stats
  });
};
