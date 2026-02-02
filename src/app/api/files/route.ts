import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, url, size, type } = await req.json();

  const record = await prisma.file.create({
    data: {
      name,
      url,
      size,
      type,
    },
  });

  return NextResponse.json(record);
}
