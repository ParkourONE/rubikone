import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;

// Verify admin session
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const tokenHash = cookieStore.get("admin_token_hash");
  return !!(session && tokenHash);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return NextResponse.json(
      { error: "GitHub-Konfiguration fehlt" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const currentPath = formData.get("currentPath") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Ungültiger Dateityp. Erlaubt: JPG, PNG, GIF, SVG, WebP, AVIF" },
        { status: 400 }
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Datei zu gross. Maximal 5 MB." },
        { status: 400 }
      );
    }

    // Determine target path
    let targetPath: string;
    if (currentPath && currentPath.startsWith("/images/")) {
      // Replace existing file at same path
      targetPath = `public${currentPath}`;
    } else {
      // Generate new path with hash to avoid conflicts
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const hash = crypto.randomBytes(4).toString("hex");
      const safeName = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-z0-9-]/gi, "-")
        .toLowerCase()
        .slice(0, 40);
      targetPath = `public/images/uploads/${safeName}-${hash}.${ext}`;
    }

    // Read file as base64
    const buffer = await file.arrayBuffer();
    const base64Content = Buffer.from(buffer).toString("base64");

    // Check if file exists (to get SHA for update)
    let existingSha: string | undefined;
    try {
      const checkRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${targetPath}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      if (checkRes.ok) {
        const existing = await checkRes.json();
        existingSha = existing.sha;
      }
    } catch {
      // File doesn't exist yet, that's fine
    }

    // Upload to GitHub
    const uploadBody: Record<string, string> = {
      message: `media: Upload ${file.name} via Admin-Panel`,
      content: base64Content,
    };
    if (existingSha) {
      uploadBody.sha = existingSha;
    }

    const uploadRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${targetPath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadBody),
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      throw new Error(err.message || "GitHub upload failed");
    }

    // Return the public path (without "public/" prefix)
    const publicPath = targetPath.replace(/^public/, "");

    return NextResponse.json({
      path: publicPath,
      message: "Bild hochgeladen",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload fehlgeschlagen" },
      { status: 500 }
    );
  }
}
