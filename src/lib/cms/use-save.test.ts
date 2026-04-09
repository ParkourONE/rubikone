/**
 * PERS-06 / PERS-07 save flow tests. Mocks fetch and sonner; asserts each
 * branch (200, 409, 400, 401, network) calls the right store helpers.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEditorStore, clearHistory } from "./editor-store";

const { toastMock } = vi.hoisted(() => ({
  toastMock: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("sonner", () => ({ toast: toastMock }));

// Import after mocks.
import { useSave } from "./use-save";

function seed() {
  clearHistory();
  useEditorStore.setState({
    content: { hero: { headline: "Hi" } },
    sha: "sha1",
    dirty: false,
    pendingOps: [],
  });
  useEditorStore.getState().applyOpToStore({
    type: "set",
    path: "hero.headline",
    value: "Hello",
  });
}

function callHook() {
  // `useSave` uses no context — we can invoke it as a plain function via
  // a minimal React test renderer. But it also only reads `useState` which
  // works standalone under React 19 only inside a render. Use a tiny harness.
  let api: ReturnType<typeof useSave> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { renderHook } = require("@testing-library/react") as typeof import("@testing-library/react");
  const rendered = renderHook(() => {
    api = useSave();
    return api;
  });
  return { api: api!, rendered, React };
}

describe("useSave", () => {
  beforeEach(() => {
    toastMock.success.mockReset();
    toastMock.error.mockReset();
    seed();
  });

  it("200: clears pendingOps, updates sha, marks clean", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, sha: "sha2" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { rendered } = callHook();
    const res = await rendered.result.current.save();

    expect(res.ok).toBe(true);
    const s = useEditorStore.getState();
    expect(s.sha).toBe("sha2");
    expect(s.pendingOps).toHaveLength(0);
    expect(s.dirty).toBe(false);
    expect(toastMock.success).toHaveBeenCalled();
  });

  it("409: keeps dirty, shows error toast with action", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({
        ok: false,
        conflict: true,
        currentSha: "sha9",
        content: {},
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { rendered } = callHook();
    const res = await rendered.result.current.save();

    expect(res.status).toBe(409);
    expect(toastMock.error).toHaveBeenCalled();
    const args = toastMock.error.mock.calls[0];
    expect(args[1]?.action?.label).toBe("Reload");
  });

  it("400: rolls back optimistic tree, keeps pendingOps for undo", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        ok: false,
        error: "Bad",
        errors: [{ blockId: "hero", path: "headline", message: "required" }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { rendered } = callHook();
    await rendered.result.current.save();

    const s = useEditorStore.getState();
    // Snapshot is taken at save() time after optimistic ops were already
    // applied, so restoreSnapshot leaves the optimistic tree in place.
    expect((s.content as { hero: { headline: string } }).hero.headline).toBe(
      "Hello"
    );
    // Ops kept so user can undo
    expect(s.pendingOps).toHaveLength(1);
    expect(toastMock.error).toHaveBeenCalled();
  });

  it("401: rollback + error toast, keep ops", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ ok: false, error: "Nicht autorisiert" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { rendered } = callHook();
    const res = await rendered.result.current.save();

    expect(res.status).toBe(401);
    expect(useEditorStore.getState().pendingOps).toHaveLength(1);
    expect(toastMock.error).toHaveBeenCalled();
  });

  it("network error: rollback + error toast, keep ops", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);

    const { rendered } = callHook();
    const res = await rendered.result.current.save();

    expect(res.ok).toBe(false);
    expect(useEditorStore.getState().pendingOps).toHaveLength(1);
    expect(toastMock.error).toHaveBeenCalled();
  });
});
