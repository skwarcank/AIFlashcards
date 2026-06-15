import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCard, createDeck } from "@/lib/test-utils/factories";
import { createJsonResponse } from "@/lib/test-utils/fetch";
import { createMockSearchParams } from "@/lib/test-utils/navigation";
import { renderWithProviders, screen, setupUser, waitFor, within } from "@/lib/test-utils/render";

const { mockUseSearchParams } = vi.hoisted(() => ({
  mockUseSearchParams: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: mockUseSearchParams,
}));

import { DeckDetailView } from "./DeckDetailView";

describe("DeckDetailView", () => {
  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(createMockSearchParams());
  });

  it("renders loaded cards and renames the deck", async () => {
    const user = setupUser();
    const deck = createDeck({ id: "deck-1", name: "Biology", description: "Cells", card_count: 1 });
    const card = createCard({ id: "card-1", front: "What is DNA?", back: "Genetic information." });
    const renamedDeck = { ...deck, name: "Chemistry" };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createJsonResponse({ cards: [card] }))
      .mockResolvedValueOnce(createJsonResponse({ deck: renamedDeck }));
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<DeckDetailView deck={deck} />);

    expect(await screen.findByText("What is DNA?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /biology/i }));
    const nameInput = screen.getByDisplayValue("Biology");
    await user.clear(nameInput);
    await user.type(nameInput, "Chemistry");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "/api/decks/deck-1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ name: "Chemistry", description: "Cells" }),
      }),
    ));
    expect(await screen.findByRole("button", { name: /chemistry/i })).toBeInTheDocument();
  });

  it("edits and deletes cards from the loaded list", async () => {
    const user = setupUser();
    const deck = createDeck({ id: "deck-1", name: "Biology", card_count: 1 });
    const card = createCard({ id: "card-1", front: "Original front", back: "Original back" });
    const updatedCard = { ...card, front: "Updated front", back: "Updated back" };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createJsonResponse({ cards: [card] }))
      .mockResolvedValueOnce(createJsonResponse({ card: updatedCard }))
      .mockResolvedValueOnce(createJsonResponse({ cards: [updatedCard] }))
      .mockResolvedValueOnce(createJsonResponse({ success: true }))
      .mockResolvedValueOnce(createJsonResponse({ cards: [] }));
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<DeckDetailView deck={deck} />);

    expect(await screen.findByText("Original front")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /edit card original front/i }));
    const frontInput = screen.getByDisplayValue("Original front");
    const backInput = screen.getByDisplayValue("Original back");
    await user.clear(frontInput);
    await user.type(frontInput, "Updated front");
    await user.clear(backInput);
    await user.type(backInput, "Updated back");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "/api/decks/deck-1/cards/card-1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ front: "Updated front", back: "Updated back" }),
      }),
    ));
    expect(await screen.findByText("Updated front")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete card updated front/i }));
    const confirm = screen.getByText(/delete "updated front"/i).closest("div");
    expect(confirm).not.toBeNull();
    await user.click(within(confirm as HTMLElement).getByRole("button", { name: /^delete$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/decks/deck-1/cards/card-1", { method: "DELETE" }));
    expect(await screen.findByText(/no cards yet/i)).toBeInTheDocument();
  });

  it("shows a retry state when cards fail to load", async () => {
    const user = setupUser();
    const deck = createDeck({ id: "deck-1", name: "Biology", card_count: 1 });
    const card = createCard({ id: "card-1" });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createJsonResponse({ error: "Failed" }, { status: 500 }))
      .mockResolvedValueOnce(createJsonResponse({ cards: [card] }));
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<DeckDetailView deck={deck} />);

    expect(await screen.findByText(/failed to load cards/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText(card.front)).toBeInTheDocument();
  });
});
