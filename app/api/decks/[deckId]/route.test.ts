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

import { DELETE, PATCH } from "./route";

const routeContext = { params: Promise.resolve({ deckId: "deck-1" }) };

function createPatchRequest(body: unknown) {
  return new Request("http://localhost/api/decks/deck-1", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

describe("/api/decks/[deckId]", () => {
  beforeEach(() => {
    mockGetAuthenticatedUser.mockReset();
  });

  describe("PATCH", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetAuthenticatedUser.mockResolvedValue(createUnauthenticatedSupabaseContext());

      const response = await PATCH(createPatchRequest({ name: "Updated" }), routeContext);

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    });

    it("returns 404 when the deck is not owned by the user", async () => {
      const lookupQuery = createSupabaseQueryMock(createSupabaseResult(null));
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([lookupQuery])));

      const response = await PATCH(createPatchRequest({ name: "Updated" }), routeContext);

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({ error: "Deck not found" });
    });

    it("updates an owned deck", async () => {
      const user = createTestUser();
      const deck = createDeck({ name: "Updated", description: null, card_count: 0 });
      const lookupQuery = createSupabaseQueryMock(createSupabaseResult({ id: deck.id }));
      const updateQuery = createSupabaseQueryMock(createSupabaseResult(deck));
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, createSupabaseClientMock([lookupQuery, updateQuery])));

      const response = await PATCH(createPatchRequest({ name: " Updated ", description: "   " }), routeContext);

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ deck });
      expect(updateQuery.update).toHaveBeenCalledWith({
        name: "Updated",
        description: null,
        updated_at: expect.any(String),
      });
      expect(updateQuery.eq).toHaveBeenCalledWith("id", "deck-1");
      expect(updateQuery.eq).toHaveBeenCalledWith("user_id", user.id);
    });
  });

  describe("DELETE", () => {
    it("returns 401 when unauthenticated", async () => {
      mockGetAuthenticatedUser.mockResolvedValue(createUnauthenticatedSupabaseContext());

      const response = await DELETE(new Request("http://localhost/api/decks/deck-1"), routeContext);

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    });

    it("returns 404 when the deck is not found", async () => {
      const lookupQuery = createSupabaseQueryMock(createSupabaseResult(null));
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([lookupQuery])));

      const response = await DELETE(new Request("http://localhost/api/decks/deck-1"), routeContext);
      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({ error: "Deck not found" });
    });

    it("deletes an owned deck", async () => {
      const user = createTestUser();
      const lookupQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
      const deleteQuery = createSupabaseQueryMock(createSupabaseResult(null));
      mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, createSupabaseClientMock([lookupQuery, deleteQuery])));

      const response = await DELETE(new Request("http://localhost/api/decks/deck-1"), routeContext);

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ success: true });
      expect(deleteQuery.delete).toHaveBeenCalled();
      expect(deleteQuery.eq).toHaveBeenCalledWith("id", "deck-1");
      expect(deleteQuery.eq).toHaveBeenCalledWith("user_id", user.id);
    });
  });
});
