import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Helper to dynamically read and configure Cloudinary credentials
export function getCloudinary() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "ncd1dai8";
  const apiKey = process.env.CLOUDINARY_API_KEY || "542122654958738";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "E1Cmg8qLUuzUB_9TzQ-bedZWMWM";

  const isConfigured = Boolean(cloudName && apiKey && apiSecret);

  if (isConfigured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  return { cloudinary, isConfigured, cloudName, apiKey };
}

export const isCloudinaryConfigured = true;

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  isFallback?: boolean;
}

/**
 * Upload a Buffer or Base64 string directly to Cloudinary
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer | string,
  folder = "sir-ihsan/products",
  fileName?: string
): Promise<CloudinaryUploadResult> {
  const { cloudinary: client, isConfigured } = getCloudinary();

  if (!isConfigured) {
    console.warn(
      "Cloudinary credentials missing. Falling back to local data URI for development."
    );

    let dataUri = "";
    if (typeof fileBuffer === "string" && fileBuffer.startsWith("data:")) {
      dataUri = fileBuffer;
    } else if (Buffer.isBuffer(fileBuffer)) {
      dataUri = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
    } else {
      dataUri = String(fileBuffer);
    }

    return {
      url: dataUri,
      secure_url: dataUri,
      public_id: `fallback-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      format: "jpg",
      isFallback: true,
    };
  }

  // Clean public_id filename if provided
  const sanitizedPublicId = fileName
    ? fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")
    : undefined;


  // Upload using Cloudinary Stream for Buffers
  if (Buffer.isBuffer(fileBuffer)) {
    return new Promise((resolve, reject) => {
      const uploadStream = client.uploader.upload_stream(
        {
          folder,
          public_id: sanitizedPublicId,
          resource_type: "image",
          transformation: [
            { quality: "auto:best" },
            { fetch_format: "auto" },
          ],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(error || new Error("Failed to upload image to Cloudinary"));
          }
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
            isFallback: false,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  // Upload using string URL or Base64
  const result = await client.uploader.upload(fileBuffer, {
    folder,
    public_id: sanitizedPublicId,
    resource_type: "image",
    transformation: [
      { quality: "auto:best" },
      { fetch_format: "auto" },
    ],
  });

  return {
    url: result.url,
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    isFallback: false,
  };
}

/**
 * Delete an image asset from Cloudinary by public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<{ result: string }> {
  if (!isCloudinaryConfigured) {
    return { result: "ok" };
  }
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
