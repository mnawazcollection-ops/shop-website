"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser } from "@/types/admin";
import { initialAdminUser } from "@/data/adminMockData";

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = "mnawaz_admin_session";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("sir_ihsan_admin_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email?.toLowerCase() === "ahsan@admin.com") {
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem("sir_ihsan_admin_session");
        }
      }
    } catch {
      // Invalid session
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === "ahsan@admin.com" && password === "Ahsan@321") {
      const loggedUser: AdminUser = {
        ...initialAdminUser,
        email: "ahsan@admin.com",
        name: "Ahsan (Super Admin)",
      };
      setUser(loggedUser);
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
      }
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: "Invalid username or password. Please verify your credentials.",
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("sir_ihsan_admin_session");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
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
