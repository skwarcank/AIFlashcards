// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient, mockGetUser } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
  mockGetUser: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: mockCreateServerClient,
}));

import { middleware } from "./middleware";

function createRequest(path: string) {
  return new NextRequest(new URL(path, "http://localhost"));
}

describe("middleware", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
    mockGetUser.mockReset();

    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });
  });

  it("redirects unauthenticated dashboard requests to login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await middleware(createRequest("/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/login");
  });

  it("redirects unauthenticated nested protected requests to login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await middleware(createRequest("/decks/deck-1"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/login");
  });

  it("redirects authenticated login requests to dashboard", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const response = await middleware(createRequest("/login"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/dashboard");
  });

  it.each([
    ["authenticated protected route", "/study/deck-1", { id: "user-1" }],
    ["unauthenticated login route", "/login", null],
  ])("passes through %s", async (_name, path, user) => {
    mockGetUser.mockResolvedValue({ data: { user } });

    const response = await middleware(createRequest(path));

    expect(response.headers.get("location")).toBeNull();
  });

  it("returns a standardized error when the auth check fails", async () => {
    mockGetUser.mockRejectedValue(new Error("Supabase unavailable"));

    const response = await middleware(createRequest("/dashboard"));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Authentication check failed" });
  });
});
