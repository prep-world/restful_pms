import { create } from "zustand";

interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: string;
}

interface AuthState {
   user: User | null;
   isAuthenticated: boolean | null;
   setUser: (data: User | null) => void;
   setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
   user: null,
   isAuthenticated: null,
   setUser: (data: User | null) => set({ user: data }),
   setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}));