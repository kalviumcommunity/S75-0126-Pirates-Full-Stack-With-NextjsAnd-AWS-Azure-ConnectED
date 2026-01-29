import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiry,
} from "@/lib/auth";
import { sanitizeInput } from "@/app/utils/sanitize"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Sanitize email (used in DB query & logs)
    const email = sanitizeInput(body.email);
    const password = body.password; 

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Prisma parameterized query → SQL Injection safe
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

    // 🔐 Create tokens
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    const response = NextResponse.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    // 🔐 Store refresh token securely (XSS + CSRF protection)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: getRefreshTokenExpiry(), // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
