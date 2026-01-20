import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const email = req.headers.get("x-user-email");
  const role = req.headers.get("x-user-role");

  // Defensive check (should never fail if middleware is correct)
  if (!email || !role) {
    return NextResponse.json(
      { success: false, message: "Unauthorized context" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "User-accessible protected data",
    user: {
      email,
      role,
    },
  });
}
