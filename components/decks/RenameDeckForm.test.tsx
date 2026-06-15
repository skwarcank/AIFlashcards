import { describe, expect, it, vi } from "vitest";

import { createDeck } from "@/lib/test-utils/factories";
import { renderWithProviders, screen, setupUser, waitFor } from "@/lib/test-utils/render";

import { RenameDeckForm } from "./RenameDeckForm";

describe("RenameDeckForm", () => {
  it("renames a deck and exits edit mode", async () => {
    const user = setupUser();
    const handleRename = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(<RenameDeckForm deck={createDeck({ name: "Biology" })} onRename={handleRename} />);

    await user.click(screen.getByRole("button", { name: /biology/i }));
    const nameInput = screen.getByDisplayValue("Biology");
    await user.clear(nameInput);
    await user.type(nameInput, "Chemistry");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(handleRename).toHaveBeenCalledWith("Chemistry"));
    expect(screen.getByRole("button", { name: /biology/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty names", async () => {
    const user = setupUser();

    renderWithProviders(<RenameDeckForm deck={createDeck({ name: "Biology" })} onRename={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /biology/i }));
    await user.clear(screen.getByDisplayValue("Biology"));
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/deck name is required/i);
  });
});
