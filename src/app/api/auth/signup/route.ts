import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {prisma} from "@/app/lib/prisma";
import redis from "@/app/lib/redis";


export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    // This will work once DB is available — no runtime error now
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Signup failed" },
      { status: 500 }
    );
  }
}
