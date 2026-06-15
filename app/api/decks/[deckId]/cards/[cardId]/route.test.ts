// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCard, createTestUser } from "@/lib/test-utils/factories";
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

const routeContext = { params: Promise.resolve({ deckId: "deck-1", cardId: "card-1" }) };

function createPatchRequest(body: unknown) {
  return new Request("http://localhost/api/decks/deck-1/cards/card-1", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

describe("/api/decks/[deckId]/cards/[cardId]", () => {
  beforeEach(() => {
    mockGetAuthenticatedUser.mockReset();
  });

  it("returns 401 when updating unauthenticated", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(createUnauthenticatedSupabaseContext());

    const response = await PATCH(createPatchRequest({ front: "Front", back: "Back" }), routeContext);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 404 when the card is not owned by the user", async () => {
    const deckQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
    const cardQuery = createSupabaseQueryMock(createSupabaseResult(null));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([deckQuery, cardQuery])));

    const response = await PATCH(createPatchRequest({ front: "Front", back: "Back" }), routeContext);
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Card not found" });
  });

  it("updates an owned card", async () => {
    const user = createTestUser();
    const card = createCard({ front: "Updated front", back: "Updated back" });
    const deckQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
    const cardQuery = createSupabaseQueryMock(createSupabaseResult({ id: "card-1" }));
    const updateQuery = createSupabaseQueryMock(createSupabaseResult(card));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, createSupabaseClientMock([deckQuery, cardQuery, updateQuery])));

    const response = await PATCH(createPatchRequest({ front: " Updated front ", back: " Updated back " }), routeContext);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ card });
    expect(updateQuery.update).toHaveBeenCalledWith({
      front: "Updated front",
      back: "Updated back",
      updated_at: expect.any(String),
    });
    expect(updateQuery.eq).toHaveBeenCalledWith("id", "card-1");
    expect(updateQuery.eq).toHaveBeenCalledWith("deck_id", "deck-1");
    expect(updateQuery.eq).toHaveBeenCalledWith("user_id", user.id);
  });

  it("deletes an owned card", async () => {
    const user = createTestUser();
    const deckQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
    const cardQuery = createSupabaseQueryMock(createSupabaseResult({ id: "card-1" }));
    const deleteQuery = createSupabaseQueryMock(createSupabaseResult(null));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, createSupabaseClientMock([deckQuery, cardQuery, deleteQuery])));

    const response = await DELETE(new Request("http://localhost/api/decks/deck-1/cards/card-1"), routeContext);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(deleteQuery.delete).toHaveBeenCalled();
    expect(deleteQuery.eq).toHaveBeenCalledWith("id", "card-1");
    expect(deleteQuery.eq).toHaveBeenCalledWith("deck_id", "deck-1");
    expect(deleteQuery.eq).toHaveBeenCalledWith("user_id", user.id);
  });
});
