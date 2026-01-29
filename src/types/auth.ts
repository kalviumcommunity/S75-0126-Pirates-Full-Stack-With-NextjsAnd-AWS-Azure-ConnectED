/**
 * TYPE DEFINITIONS FOR JWT AUTHENTICATION
 * File: src/types/auth.ts
 * 
 * TypeScript interfaces and types for the authentication system
 */

/**
 * JWT Payload structure
 * Stored inside the signed JWT token
 */
export interface JWTPayload {
  userId: number;
  iat?: number; // Issued at time
  exp?: number; // Expiration time
}

/**
 * User data returned from database
 */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt?: Date;
}

/**
 * Response from login endpoint
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  accessToken?: string;
}

/**
 * Response from refresh endpoint
 */
export interface RefreshResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: AuthUser;
}

/**
 * Response from logout endpoint
 */
export interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string; // For specific error codes like 'TOKEN_EXPIRED'
}

/**
 * Protected endpoint response structure
 */
export interface ProtectedRouteResponse {
  success: boolean;
  message: string;
  data?: {
    user: AuthUser;
    timestamp: string;
  };
}

/**
 * Auth context state
 */
export interface AuthContextState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Auth context actions
 */
export interface AuthContextActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setUser: (user: AuthUser | null) => void;
  setError: (error: string | null) => void;
}

/**
 * Auth hook return type
 */
export interface UseAuthReturn extends AuthContextState, AuthContextActions {
  checkAuth: () => void;
}

/**
 * Fetch options for authFetch function
 */
export interface AuthFetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Error response from API
 */
export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
}

/**
 * Login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User creation request
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Cookie options for refresh token
 */
export interface RefreshTokenCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

/**
 * Token verification result
 */
export interface TokenVerificationResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}

/**
 * Auth event for logging/monitoring
 */
export interface AuthEvent {
  type: 'LOGIN' | 'LOGOUT' | 'REFRESH' | 'TOKEN_EXPIRED' | 'LOGIN_FAILED';
  userId?: number;
  email?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Session information
 */
export interface SessionInfo {
  userId: number;
  email: string;
  loginTime: Date;
  expiryTime: Date;
  lastActivityTime: Date;
}

/**
 * Decoded token (for client-side display only)
 * WARNING: This does NOT verify the signature
 */
export interface DecodedToken {
  userId: number;
  iat: number;
  exp: number;
  [key: string]: any;
}

/**
 * Protected route props for wrapper component
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * API route context with authenticated user
 */
export interface AuthenticatedRequestContext {
  userId: number;
  user?: AuthUser;
  req: Request;
}

/**
 * Error codes returned by auth endpoints
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  MISSING_TOKEN = 'MISSING_TOKEN',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Success codes
 */
export enum AuthSuccessCode {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  PROTECTED_DATA = 'PROTECTED_DATA',
}

/**
 * Token configuration
 */
export interface TokenConfig {
  accessTokenExpiry: string; // "15m"
  refreshTokenExpiry: string; // "7d"
  algorithm: string; // "HS256"
}

/**
 * Auth middleware context
 */
export interface AuthMiddlewareContext {
  isProtected: boolean;
  allowedRoles?: ('ADMIN' | 'USER')[];
  excludePaths?: string[];
}
