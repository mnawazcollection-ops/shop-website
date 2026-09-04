"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

const STORAGE_KEY = "sir_ihsan_admin_session";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Automatically provide demo session on first load for frictionless development testing,
        // but still allow explicit logout / login testing
        setUser(initialAdminUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAdminUser));
      }
    } catch (e) {
      console.warn("Failed to read admin auth from localStorage", e);
      setUser(initialAdminUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    // Simulate slight network latency for authentic feel
    await new Promise((res) => setTimeout(res, 600));

    if (
      (email.toLowerCase() === "admin@sirihsan.com" && password === "admin123") ||
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
    return { success: false, error: "Invalid admin credentials. Please use admin@sirihsan.com / admin123" };
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
