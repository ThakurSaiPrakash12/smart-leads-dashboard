/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User, LoginInput, RegisterInput } from '../types/auth.types';
import { getMe, login as loginApi, logout as logoutApi, register as registerApi } from '../api/auth.api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await getMe();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadCurrentUser() {
      await fetchCurrentUser();
    }

    void loadCurrentUser();
  }, [fetchCurrentUser]);

  async function login(data: LoginInput) {
    await loginApi(data);
    await fetchCurrentUser();
  }

  async function register(data: RegisterInput) {
    await registerApi(data);
    await loginApi({ email: data.email, password: data.password });
    await fetchCurrentUser();
  }

  async function logout() {
    await logoutApi();
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
