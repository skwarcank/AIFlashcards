import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen, setupUser, waitFor } from "@/lib/test-utils/render";

import { DeleteDeckDialog } from "./DeleteDeckDialog";

describe("DeleteDeckDialog", () => {
  it("confirms deletion and closes", async () => {
    const user = setupUser();
    const handleConfirm = vi.fn().mockResolvedValue(undefined);
    const handleOpenChange = vi.fn();

    renderWithProviders(
      <DeleteDeckDialog
        open
        deckName="Biology"
        onConfirm={handleConfirm}
        onOpenChange={handleOpenChange}
      />,
    );

    expect(screen.getByText("Biology")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() => expect(handleConfirm).toHaveBeenCalledTimes(1));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
