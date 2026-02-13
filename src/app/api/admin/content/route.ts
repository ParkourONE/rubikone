import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

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

// GET: Read content.json from GitHub
export async function GET() {
  try {
    const { token, repo } = getGithubConfig();

    const res = await fetch(
      `${GITHUB_API}/repos/${repo}/contents/src/content/content.json`,
      {
        headers: githubHeaders(token),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("GitHub API error:", error);
      return NextResponse.json(
        { error: "Content konnte nicht geladen werden." },
        { status: 500 }
      );
    }

    const data = await res.json();
    const content = JSON.parse(
      Buffer.from(data.content, "base64").toString("utf-8")
    );

    return NextResponse.json({
      content,
      sha: data.sha,
    });
  } catch (error) {
    console.error("Content API GET error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}

// PUT: Write content.json back to GitHub
export async function PUT(request: Request) {
  try {
    const { token, repo } = getGithubConfig();
    const { content, sha, message } = await request.json();

    if (!content || !sha) {
      return NextResponse.json(
        { error: "Content und SHA sind erforderlich." },
        { status: 400 }
      );
    }

    // Encode content to base64
    const encodedContent = Buffer.from(
      JSON.stringify(content, null, 2) + "\n",
      "utf-8"
    ).toString("base64");

    const res = await fetch(
      `${GITHUB_API}/repos/${repo}/contents/src/content/content.json`,
      {
        method: "PUT",
        headers: githubHeaders(token),
        body: JSON.stringify({
          message: message || "content: Update via Admin-Panel",
          content: encodedContent,
          sha,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("GitHub API write error:", error);

      if (res.status === 409) {
        return NextResponse.json(
          {
            error:
              "Konflikt: Die Datei wurde zwischenzeitlich geändert. Bitte Seite neu laden.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Änderungen konnten nicht gespeichert werden." },
        { status: 500 }
      );
    }

    const result = await res.json();

    return NextResponse.json({
      success: true,
      sha: result.content.sha,
      commitUrl: result.commit.html_url,
    });
  } catch (error) {
    console.error("Content API PUT error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
