/**
 * CUSTOM REACT HOOK - useAuth
 * File: src/hooks/useAuthWithTokens.ts
 * 
 * Complete auth hook with token management
 * Use this in your React components
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  login as clientLogin,
  logout as clientLogout,
  refreshToken as clientRefresh,
  getAccessToken,
  isTokenExpired,
} from "@/lib/clientAuth";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => void;
}

/**
 * useAuth Hook
 * Manages authentication state and provides auth methods
 * 
 * USAGE:
 * ```typescript
 * function MyComponent() {
 *   const { user, isLoading, login, logout } = useAuth();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   if (!user) {
 *     return (
 *       <button onClick={() => login('user@example.com', 'password')}>
 *         Login
 *       </button>
 *     );
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user.name}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      // Token exists - user is logged in
      // (In a real app, you might verify the token with the server)
      setTimeout(() => {
        setUser({ id: 0, name: "", email: "", role: "" }); // Placeholder
        setIsLoading(false);
      }, 0);
    } else {
      setTimeout(() => setIsLoading(false), 0);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      const result = await clientLogin(email, password);

      if (result.success && result.user) {
        setUser(result.user);
        setIsLoading(false);
        return true;
      } else {
        setError(result.message);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await clientLogout();
    setUser(null);
    setIsLoading(false);
    router.push("/login");
  }, [router]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const result = await clientRefresh();

    if (result.success && result.user) {
      setUser(result.user);
      return true;
    } else {
      setError(result.message);
      // Token refresh failed - user is logged out
      setUser(null);
      return false;
    }
  }, []);

  const checkAuth = useCallback((): void => {
    if (isTokenExpired()) {
      // Token is about to expire - refresh it
      refreshToken();
    }
  }, [refreshToken]);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null && getAccessToken() !== null,
    error,
    login,
    logout,
    refreshToken,
    checkAuth,
  };
}

/**
 * PROTECTED ROUTE COMPONENT
 * Use this to wrap routes that require authentication
 * 
 * USAGE:
 * ```typescript
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
