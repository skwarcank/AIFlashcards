import { describe, expect, it, vi } from "vitest";

import { createCards } from "@/lib/test-utils/factories";
import { renderWithProviders, screen, setupUser, waitFor } from "@/lib/test-utils/render";

import { StudyView } from "./StudyView";

describe("StudyView", () => {
  it("tracks progress, known cards, and reports completion once", async () => {
    const user = setupUser();
    const cards = createCards(2);
    const handleBackToDeck = vi.fn();
    const handleComplete = vi.fn();

    renderWithProviders(
      <StudyView
        cards={cards}
        deckId="deck-1"
        onBackToDeck={handleBackToDeck}
        onComplete={handleComplete}
      />,
    );

    expect(screen.getByText("Card 1 / 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /know it/i }));
    await user.click(screen.getByRole("button", { name: /next card/i }));

    expect(screen.getByText("Card 2 / 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next card/i }));

    expect(await screen.findByRole("heading", { name: /done! reviewed 2 cards/i })).toBeInTheDocument();
    expect(screen.getByText("Score: 1 / 2 known")).toBeInTheDocument();
    await waitFor(() => expect(handleComplete).toHaveBeenCalledTimes(1));

    await user.click(screen.getByRole("button", { name: /back to deck/i }));
    expect(handleBackToDeck).toHaveBeenCalledTimes(1);
  });
});
