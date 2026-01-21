import { sendSuccess, sendError } from "@/app/utils/responseHandler";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title) {
      return sendError(
        "Missing required field: title",
        "VALIDATION_ERROR",
        400
      );
    }

    return sendSuccess(data, "Task created successfully", 201);
  } catch (err) {
    return sendError(
      "Internal Server Error",
      "TASK_CREATION_FAILED",
      500,
      err
    );
  }
}
