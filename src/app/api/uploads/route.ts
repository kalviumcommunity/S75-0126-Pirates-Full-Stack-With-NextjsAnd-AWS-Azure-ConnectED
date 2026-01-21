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

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE_MB = 5;

export async function POST(req: Request) {
  const { filename, fileType, fileSize } = await req.json();

  // HARD VALIDATION
  if (!ALLOWED_TYPES.includes(fileType)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (fileSize > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const key = `uploads/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

  return NextResponse.json({
    uploadURL,
    fileURL: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
  });
}
