import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PROTECTED ROUTE EXAMPLE
 * 
 * This endpoint demonstrates how to:
 * 1. Verify access token from Authorization header
 * 2. Extract userId from token
 * 3. Return user-specific data
 * 4. Handle expired token (401)
 * 
 * CLIENT USAGE:
 * ```javascript
 * const response = await fetch('/api/protected', {
 *   method: 'GET',
 *   headers: {
 *     'Authorization': `Bearer ${accessToken}`
 *   }
 * });
 * 
 * if (response.status === 401) {
 *   // Access token expired, call /api/auth/refresh
 *   const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });
 *   if (refreshResponse.ok) {
 *     const { accessToken: newToken } = await refreshResponse.json();
 *     // Retry original request with new token
 *   } else {
 *     // Refresh failed, redirect to login
 *   }
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
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json(
      {
        success: true,
        message: "Protected data accessed successfully",
        data: {
          user,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Handle different error types
    if (errorMessage === "Missing or invalid Authorization header") {
      return NextResponse.json(
        { success: false, message: "Missing Authorization header" },
        { status: 401 }
      );
    }

    if (errorMessage === "Access token expired") {
      return NextResponse.json(
        {
          success: false,
          message: "Access token expired. Please refresh your token.",
          code: "TOKEN_EXPIRED",
        },
        { status: 401 }
      );
    }

    if (errorMessage === "Invalid access token") {
      return NextResponse.json(
        { success: false, message: "Invalid access token" },
        { status: 401 }
      );
    }

    console.error("Protected route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST example: Create a resource for authenticated user
 * Same token verification logic applies
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const payload = await verifyAccessToken(authHeader);

    const { name } = await req.json();

    // Example: Create project for authenticated user
    const project = await prisma.project.create({
      data: {
        name,
        userId: payload.userId,
        description: "Created by authenticated user",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resource created successfully",
        data: { project },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (errorMessage === "Access token expired") {
      return NextResponse.json(
        {
          success: false,
          message: "Access token expired",
          code: "TOKEN_EXPIRED",
        },
        { status: 401 }
      );
    }

    if (
      errorMessage === "Missing or invalid Authorization header" ||
      errorMessage === "Invalid access token"
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Protected route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
