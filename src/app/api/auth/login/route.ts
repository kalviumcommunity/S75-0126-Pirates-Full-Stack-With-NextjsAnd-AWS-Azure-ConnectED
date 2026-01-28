import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { createAccessToken, createRefreshToken, getRefreshTokenExpiry } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Security: Create short-lived access token
    const accessToken = createAccessToken(user.id);

    // Security: Create long-lived refresh token (stored in HTTP-only cookie)
    const refreshToken = createRefreshToken(user.id);

    // Create response with access token
    const response = NextResponse.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    // Security: Set refresh token in HTTP-only, Secure, SameSite cookie
    // This prevents XSS attacks from accessing the token
    // SameSite=Strict prevents CSRF attacks
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: getRefreshTokenExpiry(), // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
