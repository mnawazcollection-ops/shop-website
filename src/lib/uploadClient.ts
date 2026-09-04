export interface UploadResponse {
  success: boolean;
  url: string;
  publicId?: string;
  isFallback?: boolean;
  cloudConfigured?: boolean;
  error?: string;
}

/**
 * Upload an image file from browser to Cloudinary via /api/upload
 */
export async function uploadImage(file: File, folder = "sir-ihsan/products"): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Upload a base64 string or remote image URL to Cloudinary via /api/upload
 */
export async function uploadBase64OrUrl(
  image: string,
  folder = "sir-ihsan/products",
  fileName?: string
): Promise<UploadResponse> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, folder, fileName }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed with status ${res.status}`);
  }

  return res.json();
}
