import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Logout endpoint that clears the refresh token cookie.
 *
 * Security implementation:
 * - Clears HTTP-only refresh token cookie from browser
 * - Client should also clear access token from memory/state
 * - Access token will naturally expire after 15 minutes
 *
 * Since HTTP-only cookies cannot be accessed by JavaScript,
 * simply clearing the cookie on the backend is sufficient.
 *
 * Response: 200 OK with success message
 */
export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the refresh token cookie
    // Set maxAge to 0 to delete the cookie
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // This deletes the cookie
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}
