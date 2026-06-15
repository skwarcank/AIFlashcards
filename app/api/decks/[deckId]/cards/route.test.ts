// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCard, createCards, createTestUser } from "@/lib/test-utils/factories";
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

import { GET, POST, PUT } from "./route";

const routeContext = { params: Promise.resolve({ deckId: "deck-1" }) };

function createRequest(method: string, body: unknown) {
  return new Request("http://localhost/api/decks/deck-1/cards", {
    method,
    body: JSON.stringify(body),
  });
}

describe("/api/decks/[deckId]/cards", () => {
  beforeEach(() => {
    mockGetAuthenticatedUser.mockReset();
  });

  it("returns 401 when listing cards unauthenticated", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(createUnauthenticatedSupabaseContext());

    const response = await GET(new Request("http://localhost/api/decks/deck-1/cards"), routeContext);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 404 when listing cards for an unowned deck", async () => {
    const ownershipQuery = createSupabaseQueryMock(createSupabaseResult(null));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([ownershipQuery])));

    const response = await GET(new Request("http://localhost/api/decks/deck-1/cards"), routeContext);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Deck not found" });
  });

  it("lists cards for an owned deck", async () => {
    const cards = createCards(2);
    const ownershipQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
    const cardsQuery = createSupabaseQueryMock(createSupabaseResult(cards));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([ownershipQuery, cardsQuery])));

    const response = await GET(new Request("http://localhost/api/decks/deck-1/cards"), routeContext);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ cards });
    expect(cardsQuery.eq).toHaveBeenCalledWith("deck_id", "deck-1");
    expect(cardsQuery.order).toHaveBeenCalledWith("created_at", { ascending: true });
  });

  it("creates a card for an owned deck", async () => {
    const user = createTestUser();
    const card = createCard({ front: "Front", back: "Back" });
    const ownershipQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
    const insertQuery = createSupabaseQueryMock(createSupabaseResult(card));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, createSupabaseClientMock([ownershipQuery, insertQuery])));

    const response = await POST(createRequest("POST", { front: " Front ", back: " Back " }), routeContext);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ card });
    expect(insertQuery.insert).toHaveBeenCalledWith({
      deck_id: "deck-1",
      user_id: user.id,
      front: "Front",
      back: "Back",
    });
  });

  it("returns 400 when creating an invalid card", async () => {
    const ownershipQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(createTestUser(), createSupabaseClientMock([ownershipQuery])));

    const response = await POST(createRequest("POST", { front: "", back: "Back" }), routeContext);
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toHaveProperty("error");
  });

  it("batch creates cards for an owned deck", async () => {
    const user = createTestUser();
    const cards = createCards(2);
    const ownershipQuery = createSupabaseQueryMock(createSupabaseResult({ id: "deck-1" }));
    const insertQuery = createSupabaseQueryMock(createSupabaseResult(cards));
    mockGetAuthenticatedUser.mockResolvedValue(createAuthenticatedSupabaseContext(user, createSupabaseClientMock([ownershipQuery, insertQuery])));

    const response = await PUT(createRequest("PUT", { cards: [{ front: " One ", back: " Two " }] }), routeContext);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ cards });
    expect(insertQuery.insert).toHaveBeenCalledWith([
      {
        deck_id: "deck-1",
        user_id: user.id,
        front: "One",
        back: "Two",
      },
    ]);
  });
});
