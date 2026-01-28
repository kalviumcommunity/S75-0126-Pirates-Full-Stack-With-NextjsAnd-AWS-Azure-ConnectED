import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
import { hasPermission } from "@/lib/hasPermission";
import type { Role } from "@/config/roles";

function getUserRole(req: Request): Role {
  // ✅ TEMP: mock role (replace with JWT decode later)
  const role = req.headers.get("x-user-role") as Role | null;
  return role ?? "viewer";
}

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
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const role = getUserRole(req);

  if (!hasPermission(role, "delete")) {
    return NextResponse.json(
      { error: "Access denied" },
      { status: 403 }
    );
  }

  console.log("[RBAC] Delete allowed");
  return NextResponse.json({ success: true });
}
