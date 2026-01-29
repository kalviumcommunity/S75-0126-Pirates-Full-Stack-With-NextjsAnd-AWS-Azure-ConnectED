import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * REFRESH TOKEN ENDPOINT
 * 
 * Purpose: Issue a new access token when the current one expires
 * 
 * SECURITY IMPLEMENTATION:
 * 1. Reads refresh token from HTTP-only cookie (cannot be stolen via XSS)
 * 2. Validates refresh token signature and expiry
 * 3. Issues new access token with same userId
 * 4. Optionally rotates refresh token (regenerates with new expiry)
 * 5. Returns new access token to client
 * 
 * CLIENT USAGE:
 * - Call this endpoint when you receive a 401 on a protected route
 * - Use the returned accessToken for subsequent requests
 * - Cookie is automatically set by the response
 */

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables"
  );
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Check if refresh token exists
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token not found. Please login again." },
        { status: 401 }
      );
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
        userId: number;
      };
    } catch (error) {
      const errorMsg =
        error instanceof jwt.TokenExpiredError
          ? "Refresh token expired. Please login again."
          : "Invalid refresh token";

      return NextResponse.json(
        { success: false, message: errorMsg },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Verify user still exists (optional but recommended)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    // Issue new access token
    const newAccessToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // OPTIONAL: Rotate refresh token (create new one with fresh expiry)
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create response with new access token
    const response = NextResponse.json(
      {
        success: true,
        message: "Tokens refreshed successfully",
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Update refresh token cookie with new token (rotation)
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
