import { NextResponse } from "next/server";

/**
 * LOGOUT ENDPOINT
 * 
 * Purpose: Clear the refresh token cookie to invalidate the user's session
 * 
 * SECURITY IMPLEMENTATION:
 * 1. Clears refresh token HTTP-only cookie
 * 2. Access token cannot be invalidated server-side (stateless JWT)
 *    but expires naturally after 15 minutes
 * 3. Client should also discard the access token from memory
 * 
 * CLIENT BEHAVIOR:
 * - After logout, access token remains valid until expiry (15 min)
 * - Refresh token is cleared, preventing new access token generation
 * - On next request, if access token is expired and refresh fails, user is logged out
 * - Optional: Client can implement access token blacklist for immediate revocation
 */

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear the refresh token cookie
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}

