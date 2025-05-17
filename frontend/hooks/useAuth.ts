import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: string;
}

interface LoginData {
   email: string;
   password: string;
}

// API call functions
const loginUser = (userData: LoginData) => {
   return handleApiRequest(() => unauthorizedAPI.post("/auth/login", userData));
};

const registerUser = (userData: Partial<User>) => {
   // Changed to use unauthorizedAPI since registration shouldn't require auth
   return handleApiRequest(() =>
      unauthorizedAPI.post("/auth/register", userData)
   );
};

const logoutUser = () => {
   return handleApiRequest(() => authorizedAPI.post("/auth/logout"));
};

export const useLoginUser = () => {
   const setUser = useAuthStore((state) => state.setUser);
   const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

   return useMutation({
      mutationFn: loginUser,
      onSuccess: (data: any) => {
         console.log("Login successful:", data);
         if (data && data.success) {
            const userData = data.data.user;
            setUser({
               id: userData.id,
               firstName: userData.firstName,
               lastName: userData.lastName,
               email: userData.email,
               role: userData.role,
            });
            setIsAuthenticated(true);
            return data.data;
         }
      },
      onError: (error: any) => {
         console.error("Login error:", error);
      },
   });
};

export const useRegisterUser = () => {
   return useMutation({
      mutationFn: registerUser,
      onSuccess: (data: any) => {
         console.log("Signup successful:", data);
         // The login page will handle redirections
         return data;
      },
      onError: (error: any) => {
         console.error("Signup error:", error);
      },
   });
};

export const useLogoutUser = () => {
   const setUser = useAuthStore((state) => state.setUser);
   const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

   return useMutation({
      mutationFn: logoutUser,
      onSuccess: () => {
         // Clear authentication state
         setUser(null);
         setIsAuthenticated(false);

         // Clear auth cookie
         document.cookie = "auth_token=; Max-Age=0; path=/;";

         // Return success for the component to handle redirect
         return { success: true };
      },
      onError: (error: any) => {
         console.error("Logout error:", error);
         // Even if API call fails, clear local state and cookie
         setUser(null);
         setIsAuthenticated(false);
         document.cookie = "auth_token=; Max-Age=0; path=/;";

         // Return success for the component to handle redirect
         return { success: true };
      },
   });
};

// New hook to check if user is authenticated with specific role
export const useAuthCheck = (requiredRole?: string) => {
   const { user, isAuthenticated } = useAuthStore();

   return {
      isAuthenticated,
      user,
      hasRequiredRole: user?.role === requiredRole,
   };
};
