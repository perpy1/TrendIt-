"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "./types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: "u1",
  email: "demo@trendit.app",
  display_name: "Demo User",
  auth_provider: "email",
  telegram_user_id: null,
  telegram_connected: false,
  tg_alerts_enabled: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("trendit_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    const u = { ...MOCK_USER, email };
    localStorage.setItem("trendit_user", JSON.stringify(u));
    setUser(u);
  };

  const signup = async (email: string, _password: string, displayName: string) => {
    const u = { ...MOCK_USER, email, display_name: displayName };
    localStorage.setItem("trendit_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("trendit_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
