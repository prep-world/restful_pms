import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

// Enums (based on Prisma schema for Role)
export enum Role {
   USER = "USER",
   ADMIN = "ADMIN",
}

// Types
export interface User {
   id: string;
   email: string;
   firstName: string | null;
   lastName: string | null;
   role: Role;
   createdAt: string;
   updatedAt: string;
}

export interface UpdateUserRoleDto {
   role: Role;
}

// API call functions
const fetchAllUsers = () => {
   return handleApiRequest(() => authorizedAPI.get("/users"));
};

const fetchUserById = (id: string) => {
   return handleApiRequest(() => authorizedAPI.get(`/users/${id}`));
};

const updateUserRole = (id: string, userData: UpdateUserRoleDto) => {
   return handleApiRequest(() => authorizedAPI.patch(`/users/${id}/role`, userData));
};

const deleteExistingUser = (id: string) => {
   return handleApiRequest(() => authorizedAPI.delete(`/users/${id}`));
};

// React Query hooks
export const useGetAllUsers = () => {
   return useQuery({
      queryKey: ["users"],
      queryFn: fetchAllUsers,
      onError: (error: any) => {
         console.error("Error fetching users:", error);
      },
   });
};

export const useUser = (id?: string) => {
   return useQuery({
      queryKey: ["user", id],
      queryFn: () => fetchUserById(id!),
      enabled: !!id,
      onError: (error: any) => {
         console.error(`Error fetching user ${id}:`, error);
      },
   });
};

export const useUpdateUserRole = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ id, ...data }: { id: string } & UpdateUserRoleDto) =>
         updateUserRole(id, data),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["users"] });
         queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      },
      onError: (error: any) => {
         console.error("Error updating user role:", error);
      },
   });
};

export const useDeleteUser = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteExistingUser,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["users"] });
         queryClient.invalidateQueries({ queryKey: ["user", variables] });
      },
      onError: (error: any) => {
         console.error("Error deleting user:", error);
      },
   });
};

// Utility functions
export const getRoleLabel = (role: Role) => {
   switch (role) {
      case Role.USER:
         return "User";
      case Role.ADMIN:
         return "Admin";
      default:
         return "Unknown";
   }
};

export const getRoleColor = (role: Role) => {
   switch (role) {
      case Role.USER:
         return "blue";
      case Role.ADMIN:
         return "red";
      default:
         return "gray";
   }
};