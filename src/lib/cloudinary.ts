import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Initialize Cloudinary with environment variables
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

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
  // If credentials are not set in environment, gracefully fallback to data URI for dev testing
  if (!isCloudinaryConfigured) {
    console.warn(
      "Cloudinary credentials missing in .env.local. Falling back to local data URI for development."
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

  // Upload using Cloudinary Stream for Buffers
  if (Buffer.isBuffer(fileBuffer)) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: fileName ? fileName.replace(/\.[^/.]+$/, "") : undefined,
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
  const result = await cloudinary.uploader.upload(fileBuffer, {
    folder,
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
