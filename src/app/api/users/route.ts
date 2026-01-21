
// app/api/users/route.ts
import { NextResponse } from "next/server";
import { userSchema } from "../../schemas/userSchema";
import { ZodError } from "zod";
import { sendSuccess } from "../../utils/responseHandler";
import { handleError } from "../../utils/errorHandler";
import { prisma } from "@/app/lib/prisma";
import redis from "@/app/lib/redis";

export async function GET() {
  try {
    const cacheKey = "users:list";

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("⚡ Cache Hit");
      return NextResponse.json(JSON.parse(cached));
    }

    console.log("🐢 Cache Miss – querying DB");
    const users = await prisma.user.findMany();

    await redis.set(cacheKey, JSON.stringify(users), "EX", 60);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    // HARD VALIDATION GATE
    const validatedData = userSchema.parse(body);

    // Only VALID data reaches here
    return NextResponse.json({
      success: true,
      data: validatedData,
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          errors: error.issues.map(e => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
