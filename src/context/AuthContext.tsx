"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthActionResult,
} from "@/server/types/auth.types";
import {
  loginAction,
  registerAction,
  googleLoginAction,
  logoutAction,
  getSessionAction,
} from "@/server/actions/auth.actions";
import {
  getClientCookie,
  setClientCookie,
  deleteClientCookie,
  AUTH_TOKEN_COOKIE,
  AUTH_USER_COOKIE,
} from "@/utils/cookies";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthActionResult>;
  register: (data: RegisterCredentials) => Promise<AuthActionResult>;
  googleLogin: (googleToken: string) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync auth state from cookies / session on initial mount
  useEffect(() => {
    const initAuth = async () => {
      // 1. Quick sync from client cookies for instant render
      const clientToken = getClientCookie(AUTH_TOKEN_COOKIE);
      const clientUserRaw = getClientCookie(AUTH_USER_COOKIE);

      if (clientToken && clientUserRaw) {
        try {
          const parsed = JSON.parse(clientUserRaw) as User;
          setUser(parsed);
          setToken(clientToken);
        } catch {
          // ignore parsing error
        }
      }

      // 2. Validate session via server action
      try {
        const session = await getSessionAction();
        if (session.isAuthenticated && session.user && session.token) {
          setUser(session.user);
          setToken(session.token);
        } else if (!clientToken) {
          setUser(null);
          setToken(null);
        }
      } catch {
        // network or server error fallback
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    const result = await loginAction(credentials);
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
      setClientCookie(AUTH_TOKEN_COOKIE, result.token);
      setClientCookie(AUTH_USER_COOKIE, JSON.stringify(result.user));
    }
    setIsLoading(false);
    return result;
  }, []);

  const handleRegister = useCallback(async (data: RegisterCredentials) => {
    setIsLoading(true);
    const result = await registerAction(data);
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
      setClientCookie(AUTH_TOKEN_COOKIE, result.token);
      setClientCookie(AUTH_USER_COOKIE, JSON.stringify(result.user));
    }
    setIsLoading(false);
    return result;
  }, []);

  const handleGoogleLogin = useCallback(async (googleToken: string) => {
    setIsLoading(true);
    const result = await googleLoginAction({ token: googleToken });
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
      setClientCookie(AUTH_TOKEN_COOKIE, result.token);
      setClientCookie(AUTH_USER_COOKIE, JSON.stringify(result.user));
    }
    setIsLoading(false);
    return result;
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    await logoutAction(token || undefined);
    deleteClientCookie(AUTH_TOKEN_COOKIE);
    deleteClientCookie(AUTH_USER_COOKIE);
    setUser(null);
    setToken(null);
    setIsLoading(false);
  }, [token]);

  const handleUpdateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    setClientCookie(AUTH_USER_COOKIE, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        googleLogin: handleGoogleLogin,
        logout: handleLogout,
        updateUser: handleUpdateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

