import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/session";
import { uploadImage, type MediaShape } from "@/lib/admin/media";

/**
 * Upload endpoint for the picture fields in the admin forms.
 *
 * The forms themselves post to server actions, but an upload has to happen
 * without submitting the whole form — otherwise choosing a photograph would
 * discard every other edit on the page. Hence a route the browser can call on
 * its own, which checks the session exactly as an action would.
 */
export async function POST(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was sent." }, { status: 400 });
    }

    const shape = (String(form.get("shape") ?? "product") || "product") as MediaShape;
    const uploaded = await uploadImage(file, shape);
    return NextResponse.json({ url: uploaded.url, filename: uploaded.filename });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
