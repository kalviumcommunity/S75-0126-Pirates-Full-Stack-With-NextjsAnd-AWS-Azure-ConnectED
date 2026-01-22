import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ------------------ PAGE ROUTE PROTECTION (LU) ------------------ */

  // Public pages
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  // Protected pages
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/users")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  /* ------------------ API ROUTE PROTECTION (YOUR PROJECT) ------------------ */

  const isAdminRoute = pathname.startsWith("/api/admin");
  const isUserRoute = pathname.startsWith("/api/users");
  const isProtectedRoute = isAdminRoute || isUserRoute;

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For API routes, accept both Bearer token and cookie
  let token: string | null = null;

  // Try Bearer token first
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Fallback to cookie
  if (!token) {
    token = req.cookies.get("token")?.value || null;
  }

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authorization token missing" },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/api/admin/:path*",
    "/api/users/:path*",
  ],
};
