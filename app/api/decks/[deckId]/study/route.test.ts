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

import { POST } from "./route";

const routeContext = { params: Promise.resolve({ deckId: "deck-1" }) };

describe("POST /api/decks/[deckId]/study", () => {
  beforeEach(() => {
    mockGetAuthenticatedUser.mockReset();
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(createUnauthenticatedSupabaseContext());

    const response = await POST(new Request("http://localhost/api/decks/deck-1/study"), routeContext);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 404 when the deck is not owned by the user", async () => {
    const lookupQuery = createSupabaseQueryMock(createSupabaseResult(null));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([lookupQuery])));

    const response = await POST(new Request("http://localhost/api/decks/deck-1/study"), routeContext);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Deck not found" });
  });

  it("records last studied for an owned deck", async () => {
    const user = createTestUser();
    const deck = createDeck({ card_count: 0, last_studied: "2026-06-15T12:00:00.000Z" });
    const lookupQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
    const updateQuery = createSupabaseQueryMock(createSupabaseResult(deck));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, createSupabaseClientMock([lookupQuery, updateQuery])));

    const response = await POST(new Request("http://localhost/api/decks/deck-1/study"), routeContext);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ deck });
    expect(updateQuery.update).toHaveBeenCalledWith({
      last_studied: expect.any(String),
      updated_at: expect.any(String),
    });
    expect(updateQuery.eq).toHaveBeenCalledWith("id", "deck-1");
    expect(updateQuery.eq).toHaveBeenCalledWith("user_id", user.id);
  });
});
