import { describe, expect, it, vi } from "vitest";

import { createCard } from "@/lib/test-utils/factories";
import { renderWithProviders, screen, setupUser } from "@/lib/test-utils/render";

import { CardRow } from "./CardRow";

describe("CardRow", () => {
  it("renders card text and calls edit/delete callbacks", async () => {
    const user = setupUser();
    const card = createCard({ front: "What is DNA?", back: "Genetic information." });
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    renderWithProviders(<CardRow card={card} onEdit={handleEdit} onDelete={handleDelete} />);

    expect(screen.getByText("What is DNA?")).toBeInTheDocument();
    expect(screen.getByText("Genetic information.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /edit card what is dna/i }));
    await user.click(screen.getByRole("button", { name: /delete card what is dna/i }));

    expect(handleEdit).toHaveBeenCalledWith(card);
    expect(handleDelete).toHaveBeenCalledWith(card);
  });
});
