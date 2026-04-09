/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// --- Mocks ---------------------------------------------------------------

const authState = { ok: true };
vi.mock("@/lib/admin-auth", () => ({
  isAuthenticated: vi.fn(async () => authState.ok),
}));

import contentJson from "@/content/content.json";

const realContent = contentJson as Record<string, unknown>;

function makeGithubFetchMock(
  serverContent: Record<string, unknown>,
  serverSha: string,
  putHandler?: (body: unknown) => Response
) {
  return vi.fn(async (url: string, init?: RequestInit) => {
    const u = String(url);
    if (u.includes("/contents/src/content/content.json")) {
      if (!init || !init.method || init.method === "GET") {
        return new Response(
          JSON.stringify({
            content: Buffer.from(
              JSON.stringify(serverContent, null, 2) + "\n",
              "utf-8"
            ).toString("base64"),
            sha: serverSha,
          }),
          { status: 200 }
        );
      }
      if (init.method === "PUT") {
        if (putHandler) {
          try {
            const parsed = JSON.parse(init.body as string);
            return putHandler(parsed);
          } catch {
            return new Response("bad", { status: 400 });
          }
        }
        return new Response(
          JSON.stringify({
            content: { sha: "newSha123" },
            commit: { html_url: "https://example.com/commit" },
          }),
          { status: 200 }
        );
      }
    }
    return new Response("not found", { status: 404 });
  });
}

beforeEach(() => {
  authState.ok = true;
  process.env.GITHUB_TOKEN = "test-token";
  process.env.GITHUB_REPO = "test/repo";
  process.env.ADMIN_PASSWORD = "test-pw";
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function importRoute() {
  const mod = await import("./route");
  return mod.POST;
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/admin/content/patch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/content/patch", () => {
  it("401 when unauthenticated", async () => {
    authState.ok = false;
    const POST = await importRoute();
    const res = await POST(makeRequest({ ops: [], baseSha: "x" }));
    expect(res.status).toBe(401);
  });

  it("409 when baseSha is stale", async () => {
    const fetchMock = makeGithubFetchMock(realContent, "serverSha");
    vi.stubGlobal("fetch", fetchMock);

    const POST = await importRoute();
    const res = await POST(
      makeRequest({
        ops: [
          { type: "set", path: "HERO_CONTENT.headline", value: "New" },
        ],
        baseSha: "clientStaleSha",
      })
    );
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.conflict).toBe(true);
    expect(json.currentSha).toBe("serverSha");
    expect(json.content).toBeDefined();
  });

  it("400 on validation error (breaks schema)", async () => {
    const fetchMock = makeGithubFetchMock(realContent, "goodSha");
    vi.stubGlobal("fetch", fetchMock);

    const POST = await importRoute();
    // Setting HERO_CONTENT to a number will violate the manifest schema.
    const res = await POST(
      makeRequest({
        ops: [{ type: "set", path: "HERO_CONTENT.headline", value: 42 }],
        baseSha: "goodSha",
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(Array.isArray(json.errors)).toBe(true);
  });

  it("200 happy path applies ops and commits", async () => {
    let puttedBody: { content: string; sha: string } | null = null;
    const fetchMock = makeGithubFetchMock(
      realContent,
      "goodSha",
      (body) => {
        puttedBody = body as { content: string; sha: string };
        return new Response(
          JSON.stringify({
            content: { sha: "committedSha" },
            commit: { html_url: "https://example.com/c" },
          }),
          { status: 200 }
        );
      }
    );
    vi.stubGlobal("fetch", fetchMock);

    const POST = await importRoute();
    const res = await POST(
      makeRequest({
        ops: [
          {
            type: "set",
            path: "HERO_CONTENT.headline",
            value: "Brand New Headline",
          },
        ],
        baseSha: "goodSha",
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.sha).toBe("committedSha");
    expect(puttedBody).not.toBeNull();
    expect(puttedBody!.sha).toBe("goodSha");
    const decoded = JSON.parse(
      Buffer.from(puttedBody!.content, "base64").toString("utf-8")
    );
    expect(decoded.HERO_CONTENT.headline).toBe("Brand New Headline");
  });
});
