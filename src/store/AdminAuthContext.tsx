"use client";

import React, { createContext, useContext, useState } from "react";
import { AdminUser } from "@/types/admin";
import { initialAdminUser } from "@/data/adminMockData";

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = "mnawaz_admin_session";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window === "undefined") return initialAdminUser;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("sir_ihsan_admin_session");
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAdminUser));
      return initialAdminUser;
    } catch {
      return initialAdminUser;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    // Simulate slight network latency for authentic feel
    await new Promise((res) => setTimeout(res, 600));

    if (
      (email.toLowerCase() === "admin@mnawazjewelry.com" && password === "admin123") ||
      (email.toLowerCase() === "admin@sirihsan.com" && password === "admin123") ||
      (email.toLowerCase() === "demo@mnawazjewelry.com" && password === "demo123") ||
      (email.toLowerCase() === "demo@sirihsan.com" && password === "demo123") ||
      (email.includes("@") && password.length >= 6)
    ) {
      const loggedUser: AdminUser = {
        ...initialAdminUser,
        email,
        name: email.split("@")[0].toUpperCase() + " (Admin)",
      };
      setUser(loggedUser);
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      }
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid admin credentials. Please use admin@mnawazjewelry.com / admin123" };
  };

  const quickDemoLogin = () => {
    setUser(initialAdminUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAdminUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickDemoLogin,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
