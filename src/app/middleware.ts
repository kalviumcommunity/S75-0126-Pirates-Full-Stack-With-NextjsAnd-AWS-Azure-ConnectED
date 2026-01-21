import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

type JwtPayload = {
  email: string;
  role: "ADMIN" | "USER";
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard API routes we care about
  const isAdminRoute = pathname.startsWith("/api/admin");
  const isUserRoute = pathname.startsWith("/api/users");

  if (!isAdminRoute && !isUserRoute) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Authorization token missing" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 403 }
    );
  }

  // RBAC enforcement
  if (isAdminRoute && decoded.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Admin access only" },
      { status: 403 }
    );
  }

  // Forward trusted user context
  const headers = new Headers(req.headers);
  headers.set("x-user-email", decoded.email);
  headers.set("x-user-role", decoded.role);

  return NextResponse.next({
    request: { headers },
  });
}
