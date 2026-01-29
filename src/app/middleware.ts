import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* -------------------------------------------------- */
  /*  HTTPS ENFORCEMENT (Production Only) */
  /* -------------------------------------------------- */

  if (
    process.env.NODE_ENV === "production" &&
    req.headers.get("x-forwarded-proto") !== "https"
  ) {
    const httpsUrl = req.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl);
  }

  /* -------------------------------------------------- */
  /*  PUBLIC ROUTES */
  /* -------------------------------------------------- */

  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup")
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  /* -------------------------------------------------- */
  /*  PAGE ROUTE PROTECTION */
  /* -------------------------------------------------- */

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/users")) {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  /* -------------------------------------------------- */
  /*  API ROUTE PROTECTION */
  /* -------------------------------------------------- */

  const isAdminRoute = pathname.startsWith("/api/admin");
  const isUserRoute = pathname.startsWith("/api/users");
  const isProtectedRoute = isAdminRoute || isUserRoute;

  if (!isProtectedRoute) {
    return addSecurityHeaders(NextResponse.next());
  }

  let token: string | null = null;

  // Prefer Authorization header (Best practice)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Fallback: HTTP-only cookie
  if (!token) {
    token = req.cookies.get("accessToken")?.value || null;
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

  return addSecurityHeaders(NextResponse.next());
}

/* -------------------------------------------------- */
/*  SECURITY HEADERS HELPER */
/* -------------------------------------------------- */

function addSecurityHeaders(response: NextResponse) {
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/api/admin/:path*",
    "/api/users/:path*",
  ],
};
