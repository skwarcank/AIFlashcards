import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FlipCard } from "./FlipCard";

describe("FlipCard", () => {
  it("flips on click and keyboard interaction", async () => {
    const user = userEvent.setup();
    let isFlipped = false;
    const handleFlip = () => {
      isFlipped = !isFlipped;
    };

    const { rerender } = render(
      <FlipCard
        front="Front side"
        back="Back side"
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />,
    );

    const card = screen.getByRole("button", { name: /show back of card/i });
    expect(card).toBeInTheDocument();

    await user.click(card);
    rerender(
      <FlipCard
        front="Front side"
        back="Back side"
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />,
    );

    expect(screen.getByRole("button", { name: /show front of card/i })).toBeInTheDocument();

    screen.getByRole("button", { name: /show front of card/i }).focus();
    await user.keyboard("{Enter}");
    rerender(
      <FlipCard
        front="Front side"
        back="Back side"
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />,
    );

    expect(screen.getByRole("button", { name: /show back of card/i })).toBeInTheDocument();
  });
});
