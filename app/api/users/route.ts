import { sendSuccess, sendError } from "@/src/lib/responseHandler"

export async function GET() {
  try {
    const users = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    return sendSuccess(users, "Users fetched successfully");
  } catch (err) {
    return sendError(
      "Failed to fetch users",
      "USER_FETCH_ERROR",
      500,
      err
    );
  }
}
