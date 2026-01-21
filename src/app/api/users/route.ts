
// app/api/users/route.ts
import { NextResponse } from "next/server";
import { userSchema } from "../../schemas/userSchema";
import { ZodError } from "zod";
import { sendSuccess } from "../../utils/responseHandler";
import { handleError } from "../../utils/errorHandler";

export async function GET() {
  try {
    const users = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    return sendSuccess(users, "Users fetched successfully");
  } catch (err) {
    return handleError(err, "GET /api/users");
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
