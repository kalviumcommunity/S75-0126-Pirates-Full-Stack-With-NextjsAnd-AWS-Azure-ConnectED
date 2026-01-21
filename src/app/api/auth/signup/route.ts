import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";
import { welcomeTemplate } from "@/lib/emailTemplates";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1️⃣ Check if user already exists
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

    // 3️⃣ Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 4️⃣ Send welcome email (transactional email)
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
