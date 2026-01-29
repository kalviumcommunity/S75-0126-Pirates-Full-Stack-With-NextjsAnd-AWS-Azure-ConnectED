/**
 * Authentication client utilities for frontend
 *
 * Handles token management and API calls with automatic token refresh.
 * Access token is stored in memory (not localStorage) for security.
 * Refresh token is in HTTP-only cookie (handled by browser automatically).
 */

let accessToken: string | null = null;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
}

export interface ProtectedResponse {
  success: boolean;
  data: any;
}

/**
 * Login user and store access token in memory
 * Refresh token is automatically set as HTTP-only cookie
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include", // Include cookies in request/response
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data: LoginResponse = await response.json();
  accessToken = data.accessToken; // Store in memory only
  return data;
}

/**
 * Refresh access token when it expires
 * Uses refresh token from HTTP-only cookie
 */
export async function refreshAccessToken(): Promise<RefreshResponse> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include", // Include HTTP-only cookie
  });

  if (!response.ok) {
    accessToken = null;
    throw new Error("Token refresh failed. Please login again.");
  }

  const data: RefreshResponse = await response.json();
  accessToken = data.accessToken;
  return data;
}

/**
 * Logout and clear tokens
 */
export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  accessToken = null;
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Set access token (useful when app restarts and reads from session)
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/**
 * Fetch with automatic token refresh on 401
 * Usage: Instead of fetch(), use apiCall() for protected endpoints
 */
export async function apiCall(
  url: string,
  options: RequestInit = {},
  retryOnUnauthorized = true
): Promise<Response> {
  // Add authorization header if we have a token
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  if (accessToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Include cookies
  });

  // If unauthorized (token expired) and retry enabled, refresh and retry
  if (response.status === 401 && retryOnUnauthorized) {
    try {
      await refreshAccessToken();

      // Retry the original request with new token
      if (accessToken) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
      }

      response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    } catch (error) {
      // Refresh failed, redirect to login
      console.error("Token refresh failed, please login again");
      // Optionally redirect to login page here
      throw error;
    }
  }

  return response;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return accessToken !== null;
}
