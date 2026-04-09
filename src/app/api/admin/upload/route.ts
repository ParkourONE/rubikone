import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { isAuthenticated } from "@/lib/admin-auth";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;

const PUBLIC_DIR = "public";

/**
 * Validate a user-supplied image path so it cannot escape `public/`.
 * Returns the normalized path (relative to repo root, e.g. "public/images/foo.jpg")
 * or null if invalid.
 */
function safePublicPath(currentPath: string): string | null {
  if (typeof currentPath !== "string" || currentPath.length === 0) return null;
  if (currentPath.includes("\0")) return null;
  // Must start with a leading slash path under /images/
  if (!currentPath.startsWith("/images/")) return null;

  // Normalize and resolve against a virtual public root.
  // We use posix semantics since GitHub paths are POSIX.
  const rootAbs = "/__public__";
  const joined = path.posix.normalize(rootAbs + currentPath);
  if (joined.includes("..")) return null;
  if (!joined.startsWith(rootAbs + "/")) return null;
  const rel = joined.slice(rootAbs.length); // e.g. "/images/foo.jpg"
  return `${PUBLIC_DIR}${rel}`;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
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

    // SEC-04: reject SVG by default (XSS vector).
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Ungültiger Dateityp. Erlaubt: JPG, PNG, GIF, WebP, AVIF. SVG ist aus Sicherheitsgründen nicht erlaubt.",
        },
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

    // SEC-03: Determine target path, rejecting path-traversal attempts.
    let targetPath: string;
    if (currentPath) {
      const safe = safePublicPath(currentPath);
      if (!safe) {
        return NextResponse.json(
          { error: "Ungültiger Zielpfad." },
          { status: 400 }
        );
      }
      targetPath = safe;
    } else {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
      const hash = crypto.randomBytes(4).toString("hex");
      const safeName = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-z0-9-]/gi, "-")
        .toLowerCase()
        .slice(0, 40);
      targetPath = `${PUBLIC_DIR}/images/uploads/${safeName}-${hash}.${safeExt}`;
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
