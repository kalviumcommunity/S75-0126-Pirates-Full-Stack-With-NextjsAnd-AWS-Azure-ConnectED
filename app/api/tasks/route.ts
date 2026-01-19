import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      { id: 1, title: "Setup API structure" },
      { id: 2, title: "Test endpoints" },
    ],
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Task created", data: body },
    { status: 201 }
  );
}
