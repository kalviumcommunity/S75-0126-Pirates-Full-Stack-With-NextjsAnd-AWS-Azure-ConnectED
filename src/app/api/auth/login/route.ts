import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

/**
 * SECURITY IMPLEMENTATION:
 * 1. Access token (15 min) returned in JSON response
 * 2. Refresh token (7 days) stored in HTTP-only, Secure, SameSite=Strict cookie
 * 3. No sensitive data in JWT payload
 * 4. Passwords hashed with bcrypt
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
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create access token (short-lived: 15 minutes)
    const accessToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Create refresh token (long-lived: 7 days)
    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create response with access token
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken, // Sent in response body for immediate use
      },
      { status: 200 }
    );

    // Set refresh token as HTTP-only cookie
    // SECURITY: HttpOnly prevents XSS attacks, Secure requires HTTPS, SameSite prevents CSRF
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true, // Cannot be accessed by JavaScript (prevents XSS)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/", // Available to all routes
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}

