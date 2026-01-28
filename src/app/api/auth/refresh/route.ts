import { NextResponse } from "next/server";
import { verifyRefreshToken, createAccessToken, createRefreshToken, getRefreshTokenExpiry } from "@/lib/auth";

/**
 * POST /api/auth/refresh
 *
 * Endpoint to refresh an expired access token using the refresh token.
 *
 * Security implementation:
 * 1. Reads refresh token from HTTP-only cookie (safe from XSS)
 * 2. Verifies refresh token signature and expiration
 * 3. Issues a new short-lived access token
 * 4. Optionally rotates the refresh token (optional: new token each time)
 *
 * Client usage:
 * - When access token expires (401 response), call this endpoint
 * - Cookie is automatically sent with request (no manual header needed)
 * - Returns new access token in response body
 *
 * Response:
 * {
 *   "success": true,
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
export async function POST(req: Request) {
  try {
    // Verify refresh token from cookie
    const payload = await verifyRefreshToken();
    const userId = payload.userId;

    // Issue new access token
    const newAccessToken = createAccessToken(userId);

    // Optional: Rotate refresh token for additional security
    // (This makes it harder for stolen tokens to be reused)
    const newRefreshToken = createRefreshToken(userId);

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });

    // Update the refresh token cookie with the new token
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: getRefreshTokenExpiry(), // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    // 401: Refresh token is invalid or expired
    // Client should redirect to login
    return NextResponse.json(
      { message: "Refresh token invalid or expired. Please login again." },
      { status: 401 }
    );
  }
}
