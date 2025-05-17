"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { authorizedAPI } from "@/lib/api";
import BounceLoader from "react-spinners/BounceLoader";
import { useRouter } from "next/navigation";

interface AuthProviderProps {
   children: ReactNode;
}

interface JwtPayload {
   id: string;
   role: string;
   exp?: number;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
   const { setUser, setIsAuthenticated } = useAuthStore();
   const [loading, setLoading] = useState(true);
   const [showLoading, setShowLoading] = useState(false);
   const router = useRouter();

   const getCookie = useCallback((name: string): string | undefined => {
      if (typeof window === "undefined") return undefined;

      return document.cookie
         .split("; ")
         .find((row) => row.startsWith(`${name}=`))
         ?.split("=")[1];
   }, []);

   const handleLogout = useCallback(() => {
      document.cookie =
         "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
   }, [router, setUser, setIsAuthenticated]);

   const fetchUserData = useCallback(async () => {
      try {
         const token = getCookie("auth_token");
         console.log("AuthProvider: Token exists:", !!token);

         if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
         }

         try {
            const decodedToken = jwtDecode<JwtPayload>(token);
            console.log("AuthProvider: Token decoded:", decodedToken);

            if (!decodedToken || !decodedToken.id) {
               console.log("AuthProvider: Invalid token format");
               handleLogout();
               return;
            }

            if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
               console.log("AuthProvider: Token expired");
               handleLogout();
               return;
            }

            const response = await authorizedAPI.get("/auth/me");
            console.log("AuthProvider: User data response:", response.data);

            if (!response.data.success) {
               console.log("AuthProvider: API returned unsuccessful response");
               handleLogout();
               return;
            }

            const userData = response.data.data;
            setUser({
               id: userData.id,
               firstName: userData.firstName,
               lastName: userData.lastName,
               email: userData.email,
               role: userData.role,
            });
            setIsAuthenticated(true);
         } catch (tokenError) {
            console.error("AuthProvider: Token error:", tokenError);
            handleLogout();
         }
      } catch (error) {
         console.error("AuthProvider: API or network error:", error);
         handleLogout();
      } finally {
         setLoading(false);
      }
   }, [getCookie, handleLogout, setIsAuthenticated, setUser]);

   // Initialize auth state
   useEffect(() => {
      fetchUserData();
   }, [fetchUserData]);

   // Periodic token validation
   useEffect(() => {
      const tokenCheckInterval = setInterval(() => {
         fetchUserData();
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(tokenCheckInterval);
   }, [fetchUserData]);

   // Loading state management
   useEffect(() => {
      const timer = setTimeout(() => {
         if (loading) {
            setShowLoading(true);
         }
      }, 500);

      return () => clearTimeout(timer);
   }, [loading]);

   if (loading && showLoading) {
      return (
         <div className="items-center justify-center flex min-h-screen">
            <div className="text-center">
               <BounceLoader
                  color="#4A90E2"
                  size={60}
               />
               <p className="mt-4 text-[#4A90E2]">Loading...</p>
            </div>
         </div>
      );
   }

   return <>{children}</>;
};

export default AuthProvider;
