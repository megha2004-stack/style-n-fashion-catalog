import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const categorySlug = String(formData.get("categorySlug") || "misc");

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, or WEBP images are allowed" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const dir = path.join(process.cwd(), "public", "images", categorySlug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  const imagePath = `/images/${categorySlug}/${filename}`;
  return NextResponse.json({ imagePath });
}

// Vercel free plan note: the filesystem written to here is EPHEMERAL on
// serverless — uploads work locally but will NOT persist across deploys
// in production. This route is meant for local development; before going
// live, swap the write here for a Cloudinary (or similar) upload call and
// store the returned URL in `imagePath` instead. See ARCHITECTURE.md §9.
