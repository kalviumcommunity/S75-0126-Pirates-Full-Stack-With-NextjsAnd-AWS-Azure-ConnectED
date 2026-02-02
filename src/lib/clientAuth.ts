/**
 * CLIENT-SIDE AUTH UTILITIES
 * File: src/lib/clientAuth.ts
 * 
 * Helper functions for managing authentication on the client side.
 * Use in React components and hooks.
 */

import { AuthUser } from "@/types/auth";

/**
 * Store access token in sessionStorage
 * (sessionStorage is cleared when tab closes - more secure than localStorage)
 */
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("accessToken", token);
  }
}

/**
 * Retrieve access token from sessionStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("accessToken");
}

/**
 * Clear access token from sessionStorage
 */
export function clearAccessToken(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("accessToken");
  }
}

/**
 * Check if user is authenticated (has access token)
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

/**
 * Fetch wrapper that automatically handles token refresh
 * 
 * USAGE:
 * const response = await authFetch('/api/protected', { method: 'GET' });
 * 
 * Features:
 * - Automatically adds Authorization header
 * - Handles 401 by refreshing token and retrying
 * - Redirects to login on session expiry
 * - Preserves cookies automatically
 */
export async function authFetch(
  url: string,
  options: RequestInit = {},
  onUnauthorized?: () => void
): Promise<Response> {
  const accessToken = getAccessToken();

  // Prepare headers
  const headers = new Headers(options.headers || {});

  // Add Authorization header if we have a token
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Add JSON content type if not already set
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  // Make initial request
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Important: includes cookies
  });

  // Handle 401 - attempt to refresh token
  if (response.status === 401) {
    // Try to refresh token
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      // New token issued successfully
      const data = await refreshResponse.json();
      const newAccessToken = data.accessToken;

      // Update stored token
      setAccessToken(newAccessToken);

      // Retry original request with new token
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      // Refresh failed - user is fully logged out
      clearAccessToken();

      // Call callback if provided (e.g., redirect to login)
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
  }

  return response;
}

/**
 * Login user and store access token
 * 
 * USAGE:
 * const result = await login('user@example.com', 'password');
 * if (result.success) {
 *   // Navigate to dashboard
 * } else {
 *   // Show error message
 * }
 */
export async function login(
  email: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  user?: AuthUser;
  accessToken?: string;
}> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Important: allows cookies to be set
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    // Store access token
    setAccessToken(data.accessToken);

    return {
      success: true,
      message: "Login successful",
      user: data.user,
      accessToken: data.accessToken,
    };
  } catch {
    return { success: false, message: "Login failed" };
  }
}

/**
 * Logout user and clear tokens
 * 
 * USAGE:
 * await logout();
 * // User is logged out, redirect to login page
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    // Clear local token regardless of response
    clearAccessToken();

    return {
      success: response.ok,
      message: data.message || "Logged out",
    };
  } catch {
    // Even if logout fails, clear local token
    clearAccessToken();
    return { success: false, message: "Logout failed" };
  }
}

/**
 * Refresh access token
 * 
 * USAGE:
 * const result = await refreshToken();
 * if (result.success) {
 *   // Continue with new token
 * } else {
 *   // Redirect to login
 * }
 */
export async function refreshToken(): Promise<{
  success: boolean;
  message: string;
  accessToken?: string;
  user?: AuthUser;
}> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Token refresh failed" };
    }

    // Store new token
    setAccessToken(data.accessToken);

    return {
      success: true,
      message: "Token refreshed",
      accessToken: data.accessToken,
      user: data.user,
    };
  } catch {
    return { success: false, message: "Token refresh failed" };
  }
}

/**
 * Decode JWT token (without verification - for display purposes only)
 * 
 * SECURITY WARNING:
 * - This does NOT verify the token signature
 * - Use only to read claims for display (e.g., user ID)
 * - Always verify token on server side before trusting
 * 
 * USAGE:
 * const payload = decodeToken(accessToken);
 * console.log(payload.userId); // Access token claims
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Check if access token is expired
 * (useful for preemptive refresh)
 * 
 * USAGE:
 * if (isTokenExpired()) {
 *   // Refresh before making request
 * }
 */
export function isTokenExpired(): boolean {
  const token = getAccessToken();
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== 'number') return true;

  // Check if expired (with 1-minute buffer)
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now + 60;
}
