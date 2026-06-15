import { describe, expect, it, vi } from "vitest";

import { createCard } from "@/lib/test-utils/factories";
import { renderWithProviders, screen, setupUser, waitFor } from "@/lib/test-utils/render";

import { EditCardModal } from "./EditCardModal";

describe("EditCardModal", () => {
  it("validates required card fields", async () => {
    const user = setupUser();
    const card = createCard({ front: "Original front", back: "Original back" });

    renderWithProviders(<EditCardModal open card={card} onOpenChange={vi.fn()} onSave={vi.fn()} />);

    await user.clear(screen.getByLabelText(/front/i));
    await user.clear(screen.getByLabelText(/back/i));
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("saves edited values and closes", async () => {
    const user = setupUser();
    const handleOpenChange = vi.fn();
    const handleSave = vi.fn().mockResolvedValue(undefined);
    const card = createCard({ front: "Original front", back: "Original back" });

    renderWithProviders(<EditCardModal open card={card} onOpenChange={handleOpenChange} onSave={handleSave} />);

    await user.clear(screen.getByLabelText(/front/i));
    await user.type(screen.getByLabelText(/front/i), " Updated front ");
    await user.clear(screen.getByLabelText(/back/i));
    await user.type(screen.getByLabelText(/back/i), " Updated back ");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(handleSave).toHaveBeenCalledWith("Updated front", "Updated back"));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
