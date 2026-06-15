// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDeck, createTestUser } from "@/lib/test-utils/factories";
import {
  createAuthenticatedSupabaseContext,
  createSupabaseClientMock,
  createSupabaseQueryMock,
  createSupabaseResult,
  createUnauthenticatedSupabaseContext,
} from "@/lib/test-utils/supabase";

const { mockGetAuthenticatedUser } = vi.hoisted(() => ({
  mockGetAuthenticatedUser: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  getAuthenticatedUser: mockGetAuthenticatedUser,
}));

import { GET, POST } from "./route";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/decks", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("/api/decks", () => {
  beforeEach(() => {
    mockGetAuthenticatedUser.mockReset();
  });

  describe("GET", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetAuthenticatedUser.mockResolvedValue(createUnauthenticatedSupabaseContext());

      const response = await GET();

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    });

    it("returns decks with mapped card counts", async () => {
      const user = createTestUser();
      const deck = createDeck();
      const query = createSupabaseQueryMock(
        createSupabaseResult([
          {
            ...deck,
            cards: [{ count: 7 }],
          },
        ]),
      );
      const supabase = createSupabaseClientMock([query]);
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, supabase));

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ decks: [{ ...deck, card_count: 7 }] });
      expect(supabase.from).toHaveBeenCalledWith("decks");
      expect(query.eq).toHaveBeenCalledWith("user_id", user.id);
      expect(query.order).toHaveBeenCalledWith("updated_at", { ascending: false });
    });

    it("returns 500 when Supabase returns an error", async () => {
      const query = createSupabaseQueryMock(createSupabaseResult(null, new Error("Database unavailable")));
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([query])));

      const response = await GET();

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({ error: "Database unavailable" });
    });
  });

  describe("POST", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetAuthenticatedUser.mockResolvedValue(createUnauthenticatedSupabaseContext());

      const response = await POST(createRequest({ name: "Biology" }));

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    });

    it("returns 400 for invalid JSON", async () => {
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext());

      const response = await POST(
        new Request("http://localhost/api/decks", {
          method: "POST",
          body: "{bad json",
        }),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({ error: "Invalid JSON body" });
    });

    it("returns 400 for invalid deck payloads", async () => {
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext());

      const response = await POST(createRequest({ name: "" }));

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toHaveProperty("error");
    });

    it("creates a deck for the authenticated user", async () => {
      const user = createTestUser();
      const deck = createDeck({ name: "Chemistry", description: null, card_count: 0 });
      const query = createSupabaseQueryMock(createSupabaseResult(deck));
      const supabase = createSupabaseClientMock([query]);
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, supabase));

      const response = await POST(createRequest({ name: " Chemistry ", description: "   " }));

      expect(response.status).toBe(201);
      await expect(response.json()).resolves.toEqual({ deck });
      expect(query.insert).toHaveBeenCalledWith({
        user_id: user.id,
        name: "Chemistry",
        description: null,
      });
    });

    it("returns 500 when deck creation fails", async () => {
      const query = createSupabaseQueryMock(createSupabaseResult(null, new Error("Insert failed")));
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([query])));

      const response = await POST(createRequest({ name: "Chemistry" }));

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({ error: "Insert failed" });
    });
  });
});
