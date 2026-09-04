import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Handle multipart/form-data upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "sir-ihsan/products";

      if (!file) {
        return NextResponse.json({ error: "No file provided in form data" }, { status: 400 });
      }

      // Check file size (limit 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size exceeds 10MB maximum limit" },
          { status: 400 }
        );
      }

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadToCloudinary(buffer, folder, file.name);

      return NextResponse.json({
        success: true,
        url: result.secure_url || result.url,
        publicId: result.public_id,
        isFallback: result.isFallback,
        cloudConfigured: isCloudinaryConfigured,
        format: result.format,
      });
    }

    // 2. Handle JSON base64 or URL upload
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { image, folder = "sir-ihsan/products", fileName } = body;

      if (!image) {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
      }

      const result = await uploadToCloudinary(image, folder, fileName);

      return NextResponse.json({
        success: true,
        url: result.secure_url || result.url,
        publicId: result.public_id,
        isFallback: result.isFallback,
        cloudConfigured: isCloudinaryConfigured,
        format: result.format,
      });
    }

    return NextResponse.json(
      { error: "Unsupported content type. Send multipart/form-data or application/json" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process image upload";
    console.error("API /api/upload error:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Cloudinary Upload API for Sir Ihsan Jewelry",
    isConfigured: isCloudinaryConfigured,
  });
}
