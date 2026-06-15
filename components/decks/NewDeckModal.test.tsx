import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen, setupUser, waitFor } from "@/lib/test-utils/render";

import { NewDeckModal } from "./NewDeckModal";

describe("NewDeckModal", () => {
  it("validates required deck names", async () => {
    const user = setupUser();

    renderWithProviders(<NewDeckModal open onOpenChange={vi.fn()} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/deck name is required/i);
  });

  it("submits deck values and closes", async () => {
    const user = setupUser();
    const handleOpenChange = vi.fn();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(<NewDeckModal open onOpenChange={handleOpenChange} onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/name/i), " Biology ");
    await user.type(screen.getByLabelText(/description/i), " Cell basics ");
    await user.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledWith({ name: "Biology", description: "Cell basics" }));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
