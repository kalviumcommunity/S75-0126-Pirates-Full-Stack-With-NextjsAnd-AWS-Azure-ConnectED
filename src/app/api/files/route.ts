import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, key, url } = await req.json();

  const record = await prisma.file.create({
    data: {
      name,
      key,
      url,
    },
  });

  return NextResponse.json(record);
}
