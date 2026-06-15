import { describe, expect, it, vi } from "vitest";

import { createJsonResponse } from "@/lib/test-utils/fetch";
import { renderWithProviders, screen, setupUser, waitFor } from "@/lib/test-utils/render";

import { AIGenerate } from "./AIGenerate";

const sourceText = "This is a sufficiently long source text about biology that can be used to generate flashcards.";

describe("AIGenerate", () => {
  it("generates suggestions and adds accepted cards", async () => {
    const user = setupUser();
    const onCardsAdded = vi.fn().mockResolvedValue(undefined);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createJsonResponse({ suggestions: [{ front: "Question 1", back: "Answer 1" }] }))
      .mockResolvedValueOnce(createJsonResponse({ cards: [] }, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<AIGenerate deckId="deck-1" onCardsAdded={onCardsAdded} />);

    await user.type(screen.getByLabelText(/source text/i), sourceText);
    await user.clear(screen.getByLabelText(/count/i));
    await user.type(screen.getByLabelText(/count/i), "1");
    await user.click(screen.getByRole("button", { name: /^generate$/i }));

    expect(await screen.findByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Answer 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add accepted \(1\)/i }));

    await waitFor(() => expect(onCardsAdded).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/generate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ sourceText, count: 1 }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/decks/deck-1/cards/batch",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ cards: [{ front: "Question 1", back: "Answer 1" }] }),
      }),
    );
    expect(await screen.findByText(/added 1 cards/i)).toBeInTheDocument();
  });

  it("disables adding when all suggestions are discarded", async () => {
    const user = setupUser();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createJsonResponse({ suggestions: [{ front: "Question 1", back: "Answer 1" }] })),
    );

    renderWithProviders(<AIGenerate deckId="deck-1" onCardsAdded={vi.fn()} />);

    await user.type(screen.getByLabelText(/source text/i), sourceText);
    await user.click(screen.getByRole("button", { name: /^generate$/i }));
    await screen.findByText("Question 1");

    await user.click(screen.getByRole("button", { name: /discard/i }));

    expect(screen.getByRole("button", { name: /add accepted \(0\)/i })).toBeDisabled();
  });

  it("shows retry cooldown after rate limits", async () => {
    const user = setupUser();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(createJsonResponse({ error: "Rate limited" }, { status: 429, headers: { "Retry-After": "45" } })),
    );

    renderWithProviders(<AIGenerate deckId="deck-1" onCardsAdded={vi.fn()} />);

    await user.type(screen.getByLabelText(/source text/i), sourceText);
    await user.click(screen.getByRole("button", { name: /^generate$/i }));

    expect(await screen.findByText(/rate limited/i)).toBeInTheDocument();
    expect(screen.getByText(/retry in 45 seconds/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeDisabled();
  });
});
