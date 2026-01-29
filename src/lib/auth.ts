import { jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * SECURITY NOTES:
 * - Access tokens are short-lived (15 min) and verified from Authorization header
 * - Refresh tokens are long-lived (7 days) and stored in HTTP-only cookies only
 * - No sensitive data stored in JWT payload (only userId)
 * - All tokens are signed with cryptographically secure secrets
 */

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables"
  );
}

// Convert string secrets to Uint8Array for jose/jwtVerify
const getAccessTokenSecret = () => new TextEncoder().encode(JWT_SECRET);
const getRefreshTokenSecret = () => new TextEncoder().encode(REFRESH_TOKEN_SECRET);

/**
 * JWT Payload Interface
 */
export interface JWTPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

/**
 * Verify access token from Authorization header
 * Expected format: "Bearer <token>"
 * @throws Error if token is missing, invalid, or expired
 * @returns JWTPayload with userId
 */
export async function verifyAccessToken(authHeader: string | null): Promise<JWTPayload> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const verified = await jwtVerify(
      token,
      getAccessTokenSecret()
    );
    
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("token expired")) {
        throw new Error("Access token expired");
      }
    }
    throw new Error("Invalid access token");
  }
}

/**
 * Verify refresh token from HTTP-only cookies
 * @throws Error if token is missing, invalid, or expired
 * @returns JWTPayload with userId
 */
export async function verifyRefreshToken(): Promise<JWTPayload> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  try {
    const verified = await jwtVerify(
      refreshToken,
      getRefreshTokenSecret()
    );

    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("token expired")) {
        throw new Error("Refresh token expired");
      }
    }
    throw new Error("Invalid refresh token");
  }
}

/**
 * Create an access token (short-lived)
 * @param userId - User ID to encode in token
 * @returns JWT access token
 */
export function createAccessToken(userId: number): string {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 15 * 60; // 15 minutes

  const payload: JWTPayload = {
    userId,
    iat: now,
    exp: now + expiresIn,
  };

  // Note: For production, use jose.SignJWT instead of jsonwebtoken
  // This is a simplified version. See updated login/refresh routes for proper implementation
  return JSON.stringify(payload); // Placeholder - actual implementation in route handlers
}

/**
 * Create a refresh token (long-lived)
 * @param userId - User ID to encode in token
 * @returns JWT refresh token
 */
export function createRefreshToken(userId: number): string {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60; // 7 days

  const payload: JWTPayload = {
    userId,
    iat: now,
    exp: now + expiresIn,
  };

  // Note: For production, use jose.SignJWT instead of jsonwebtoken
  return JSON.stringify(payload); // Placeholder - actual implementation in route handlers
}
