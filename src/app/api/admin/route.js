import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Welcome Admin. Full access granted.",
  });
}
