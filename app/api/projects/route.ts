import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      { id: 1, name: "ConnectED" },
      { id: 2, name: "Offline Learning App" },
    ],
  });
}
