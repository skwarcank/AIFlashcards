import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen, setupUser, waitFor } from "@/lib/test-utils/render";

import { ManualAdd } from "./ManualAdd";

describe("ManualAdd", () => {
  it("validates required card fields", async () => {
    const user = setupUser();

    renderWithProviders(<ManualAdd onAdd={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /^add$/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("submits a new card and resets the form", async () => {
    const user = setupUser();
    const handleAdd = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(<ManualAdd onAdd={handleAdd} />);

    await user.type(screen.getByLabelText(/front/i), " What is DNA? ");
    await user.type(screen.getByLabelText(/back/i), " Genetic information ");
    await user.click(screen.getByRole("button", { name: /^add$/i }));

    await waitFor(() => expect(handleAdd).toHaveBeenCalledWith("What is DNA?", "Genetic information"));
    expect(screen.getByLabelText(/front/i)).toHaveValue("");
    expect(screen.getByLabelText(/back/i)).toHaveValue("");
  });
});
