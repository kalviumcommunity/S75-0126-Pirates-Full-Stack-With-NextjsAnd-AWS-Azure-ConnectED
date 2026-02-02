import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { filename, fileType, fileSize } = await req.json();

    // HARD validation (frontend validation is useless alone)
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const key = `uploads/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(s3, command, {
      expiresIn: 60, // seconds
    });

    return NextResponse.json({
      uploadURL,
      fileKey: key,
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}
