import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { welcomeTemplate } from "@/lib/emailTemplates";
import sendgrid from "@sendgrid/mail";
import { sanitizeInput } from "@/app/utils/sanitize"; 

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Sanitize user-controlled string inputs
    const name = sanitizeInput(body.name);
    const email = sanitizeInput(body.email);
    const password = body.password; // ❌ NEVER sanitize passwords

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if user already exists (Prisma = SQLi safe)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user with sanitized data
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 4️⃣ Send welcome email (safe sanitized name)
    await sendgrid.send({
      to: email,
      from: process.env.SENDGRID_SENDER!,
      subject: "Welcome to Kalvium 🚀",
      html: welcomeTemplate(name),
    });

    return NextResponse.json({
      success: true,
      message: "Signup successful. Welcome email sent!",
      userId: user.id,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { success: false, message: "Signup failed" },
      { status: 500 }
    );
  }
}
