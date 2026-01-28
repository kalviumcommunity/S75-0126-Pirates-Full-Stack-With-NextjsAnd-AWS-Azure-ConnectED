import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// Security: Use TextEncoder to convert secret to Uint8Array for jose library
const getAccessTokenSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
};

const getRefreshTokenSecret = () => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
};

export interface TokenPayload {
  userId: number;
  iat: number;
  exp: number;
}

/**
 * Verify access token from Authorization header
 * Expected format: "Bearer <token>"
 *
 * Security considerations:
 * - Throws 401 if token is missing or invalid
 * - Expires after 15 minutes
 * - Does not contain sensitive data
 */
export async function verifyAccessToken(
  authHeader: string | null
): Promise<TokenPayload> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const secret = getAccessTokenSecret();
    const verified = await jwtVerify(token, secret);
    return verified.payload as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
}

/**
 * Verify refresh token from HTTP-only cookie
 *
 * Security considerations:
 * - Read from secure HTTP-only cookie only
 * - Expires after 7 days
 * - Used to issue new access tokens
 */
export async function verifyRefreshToken(): Promise<TokenPayload> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  try {
    const secret = getRefreshTokenSecret();
    const verified = await jwtVerify(refreshToken, secret);
    return verified.payload as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

/**
 * Create access token
 * Valid for 15 minutes
 */
export function createAccessToken(userId: number): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  // Note: Using jsonwebtoken for signing, jose for verification
  // This is intentional to demonstrate both approaches work together
  const jwt = require("jsonwebtoken");

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: "15m" } // Access token expires in 15 minutes
  );
}

/**
 * Create refresh token
 * Valid for 7 days
 */
export function createRefreshToken(userId: number): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET is not set");
  }

  const jwt = require("jsonwebtoken");

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );
}

/**
 * Get token expiration time
 * Used for setting cookie maxAge
 */
export function getRefreshTokenExpiry(): number {
  // 7 days in milliseconds
  return 7 * 24 * 60 * 60 * 1000;
}
