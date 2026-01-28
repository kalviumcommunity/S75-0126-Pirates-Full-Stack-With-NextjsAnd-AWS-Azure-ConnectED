import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/protected
 *
 * Example of a protected route that requires a valid access token.
 *
 * Security implementation:
 * 1. Verifies access token from Authorization header
 * 2. Extracts userId from token payload
 * 3. Fetches user-specific data from database
 * 4. Returns 401 if token is missing, invalid, or expired
 *
 * Client usage:
 * - Include Authorization header: "Authorization: Bearer <accessToken>"
 * - If you get 401, call POST /api/auth/refresh to get a new access token
 * - Retry the request with the new access token
 *
 * Example client code:
 * ```typescript
 * const response = await fetch("/api/protected", {
 *   headers: {
 *     "Authorization": `Bearer ${accessToken}`
 *   }
 * });
 *
 * if (response.status === 401) {
 *   // Token expired, refresh it
 *   const refreshResponse = await fetch("/api/auth/refresh", { method: "POST" });
 *   const { accessToken: newToken } = await refreshResponse.json();
 *   // Retry with new token
 * }
 * ```
 */
export async function GET(req: Request) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.get("authorization");

    // Verify access token
    const payload = await verifyAccessToken(authHeader);
    const userId = payload.userId;

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return user-specific data
    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    // Token is missing, invalid, or expired
    return NextResponse.json(
      {
        message: "Unauthorized. Invalid or expired access token.",
        code: "INVALID_TOKEN",
      },
      { status: 401 }
    );
  }
}

/**
 * Example POST endpoint showing how to use the protected route pattern
 * for different HTTP methods
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const payload = await verifyAccessToken(authHeader);
    const userId = payload.userId;

    // Process request using userId
    const body = await req.json();

    return NextResponse.json(
      {
        success: true,
        message: "Request processed",
        userId,
        data: body,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unauthorized. Invalid or expired access token.",
        code: "INVALID_TOKEN",
      },
      { status: 401 }
    );
  }
}
