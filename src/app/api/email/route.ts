import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    await sendgrid.send({
      to,
      from: process.env.SENDGRID_SENDER!,
      subject,
      html: message,
    });

    console.log("Email sent successfully to:", to);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendGrid Error:", error);
    return NextResponse.json(
      { success: false, error: "Email sending failed" },
      { status: 500 }
    );
  }
}
