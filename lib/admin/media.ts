import { createHash } from "node:crypto";
import sharp from "sharp";

/**
 * Uploading a picture.
 *
 * Pictures go straight to Cloudinary from the form that needs them, and the
 * shop stores nothing but the address that comes back — products hold
 * `images: ["https://res.cloudinary.com/…"]`. Cloudinary's own media library is
 * the place to browse or tidy what has been uploaded, so the panel does not
 * carry a second one.
 *
 * The file is cropped to the chosen shape and converted to WebP on the way in:
 * the shop uploads what the camera or the supplier sent, and the site gets
 * something it can actually serve.
 */

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const FOLDER = "time-house";

export type MediaShape = "product" | "square" | "wide" | "logo";

const SHAPES: Record<MediaShape, { width: number; height: number | null }> = {
  product: { width: 1200, height: 1500 }, // 4:5, the card and gallery shape
  square: { width: 1100, height: 1100 },
  wide: { width: 1600, height: 900 },
  logo: { width: 512, height: null }, // keep whatever proportions the mark has
};

export interface MediaFile {
  url: string;
  filename: string;
  width: number;
  height: number;
}

function credentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured — add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and " +
        "CLOUDINARY_API_SECRET to .env.local and restart.",
    );
  }
  return { cloudName, apiKey, apiSecret };
}

/** Crop, rotate and re-encode before anything leaves the server. */
async function normalise(file: File, shape: MediaShape) {
  if (!file || file.size === 0) throw new Error("No file was chosen.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`That file is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 12MB.`);
  }
  if (!file.type.startsWith("image/")) throw new Error("That is not an image.");

  const input = Buffer.from(await file.arrayBuffer());
  const { width, height } = SHAPES[shape];

  let pipeline = sharp(input, { failOn: "none" }).rotate(); // honour EXIF orientation
  pipeline = height
    ? pipeline.resize(width, height, { fit: "cover", position: sharp.strategy.attention })
    : pipeline.resize(width, undefined, { fit: "inside", withoutEnlargement: true });

  const data = await pipeline.webp({ quality: 86, effort: 5 }).toBuffer();
  const name = `${file.name.replace(/\.[^.]+$/, "") || "image"}.webp`;
  return { data, name };
}

/** Cloudinary signs with a SHA-1 of the sorted parameters plus the secret. */
function sign(params: Record<string, string>, secret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(payload + secret).digest("hex");
}

export async function uploadImage(file: File, shape: MediaShape = "product"): Promise<MediaFile> {
  const { cloudName, apiKey, apiSecret } = credentials();
  const { data, name } = await normalise(file, shape);

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = `${FOLDER}/${shape}`;
  const signature = sign({ folder, timestamp }, apiSecret);

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(data)], { type: "image/webp" }), name);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Cloudinary refused the upload (${res.status}): ${detail.slice(0, 200)}`);
  }

  const json = await res.json();
  return {
    url: json.secure_url as string,
    filename: name,
    width: json.width as number,
    height: json.height as number,
  };
}
