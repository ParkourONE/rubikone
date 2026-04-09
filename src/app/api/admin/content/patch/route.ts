/**
 * PATCH endpoint — admin-only.
 *
 * Accepts a batch of editor operations + the client's last-known GitHub SHA,
 * re-fetches the live content.json from GitHub, and applies the ops on top.
 *
 * Conflict model (PERS-03):
 * - If GitHub's current SHA no longer matches `baseSha`, the client is stale.
 *   Return 409 with the fresh SHA + content so the client can rebase.
 * - Otherwise apply ops → migrate → validate → commit.
 *
 * Auth and GitHub plumbing mirror `src/app/api/admin/content/route.ts`.
 */
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { validateContent } from "@/lib/blocks";
import { migrateContent } from "@/lib/content-migrations";
import { applyOps, type Op } from "@/lib/cms/operations";

const GITHUB_API = "https://api.github.com";
const CONTENT_PATH = "src/content/content.json";

function getGithubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN und GITHUB_REPO müssen konfiguriert sein.");
  }
  return { token, repo };
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

async function fetchCurrent(
  token: string,
  repo: string
): Promise<{ content: Record<string, unknown>; sha: string }> {
  const res = await fetch(
    `${GITHUB_API}/repos/${repo}/contents/${CONTENT_PATH}`,
    { headers: githubHeaders(token), cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`GitHub fetch failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { content: string; sha: string };
  const content = JSON.parse(
    Buffer.from(data.content, "base64").toString("utf-8")
  );
  return { content, sha: data.sha };
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "Nicht autorisiert" },
      { status: 401 }
    );
  }

  let body: { ops?: Op[]; baseSha?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { ops, baseSha, message } = body;
  if (!Array.isArray(ops) || typeof baseSha !== "string" || !baseSha) {
    return NextResponse.json(
      { ok: false, error: "ops[] und baseSha sind erforderlich." },
      { status: 400 }
    );
  }

  try {
    const { token, repo } = getGithubConfig();
    const { content: current, sha: currentSha } = await fetchCurrent(token, repo);

    if (currentSha !== baseSha) {
      return NextResponse.json(
        { ok: false, conflict: true, currentSha, content: current },
        { status: 409 }
      );
    }

    // Apply ops against the live tree.
    let nextTree: Record<string, unknown>;
    try {
      const result = applyOps(current, ops);
      nextTree = result.next;
    } catch (err) {
      return NextResponse.json(
        {
          ok: false,
          error: err instanceof Error ? err.message : "Operation failed",
        },
        { status: 400 }
      );
    }

    // Migrate + validate via the block registry.
    const migrated = migrateContent(nextTree);
    const issues = validateContent(migrated);
    if (issues.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Content entspricht nicht dem Block-Schema.",
          errors: issues.map((i) => ({
            blockId: i.blockId,
            path: i.path,
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const encoded = Buffer.from(
      JSON.stringify(migrated, null, 2) + "\n",
      "utf-8"
    ).toString("base64");

    const putRes = await fetch(
      `${GITHUB_API}/repos/${repo}/contents/${CONTENT_PATH}`,
      {
        method: "PUT",
        headers: githubHeaders(token),
        body: JSON.stringify({
          message: message || "content: PATCH via Admin-Panel",
          content: encoded,
          sha: currentSha,
        }),
      }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      // Race: someone wrote between our GET and PUT. Fetch again and surface
      // the fresh SHA/content so the client can rebase.
      if (putRes.status === 409) {
        try {
          const fresh = await fetchCurrent(token, repo);
          return NextResponse.json(
            {
              ok: false,
              conflict: true,
              currentSha: fresh.sha,
              content: fresh.content,
            },
            { status: 409 }
          );
        } catch {
          // fall through
        }
      }
      console.error("GitHub PATCH write error:", errText);
      return NextResponse.json(
        { ok: false, error: "Änderungen konnten nicht gespeichert werden." },
        { status: 500 }
      );
    }

    const result = (await putRes.json()) as {
      content: { sha: string };
      commit: { html_url: string };
    };
    return NextResponse.json({
      ok: true,
      sha: result.content.sha,
      commitUrl: result.commit.html_url,
    });
  } catch (error) {
    console.error("Content PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
