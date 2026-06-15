import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDeck } from "@/lib/test-utils/factories";
import { createJsonResponse } from "@/lib/test-utils/fetch";
import { createMockRouter, mockPush, resetNavigationMocks } from "@/lib/test-utils/navigation";
import { renderWithProviders, screen, setupUser, waitFor } from "@/lib/test-utils/render";

const { mockUseRouter } = vi.hoisted(() => ({
  mockUseRouter: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: mockUseRouter,
}));

import DashboardPage from "./page";

describe("DashboardPage", () => {
  beforeEach(() => {
    resetNavigationMocks();
    mockUseRouter.mockReturnValue(createMockRouter());
  });

  it("creates a deck from the empty state and navigates to add cards", async () => {
    const user = setupUser();
    const deck = createDeck({ id: "deck-new", name: "Chemistry", description: "Atoms" });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createJsonResponse({ decks: [] }))
      .mockResolvedValueOnce(createJsonResponse({ deck }, { status: 201 }))
      .mockResolvedValueOnce(createJsonResponse({ decks: [deck] }));
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText(/create your first deck/i)).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: /new deck/i })[0]);
    await user.type(screen.getByLabelText(/name/i), "Chemistry");
    await user.type(screen.getByLabelText(/description/i), "Atoms");
    await user.click(screen.getByRole("button", { name: /create deck/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "/api/decks",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Chemistry", description: "Atoms" }),
      }),
    ));
    expect(mockPush).toHaveBeenCalledWith("/decks/deck-new?add=ai");
  }, 10_000);

  it("deletes a deck and refreshes the list", async () => {
    const user = setupUser();
    const deck = createDeck({ id: "deck-1", name: "Biology" });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createJsonResponse({ decks: [deck] }))
      .mockResolvedValueOnce(createJsonResponse({ success: true }))
      .mockResolvedValueOnce(createJsonResponse({ decks: [] }));
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText("Biology")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /delete biology/i }));
    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/decks/deck-1", { method: "DELETE" }));
    expect(await screen.findByText(/create your first deck/i)).toBeInTheDocument();
  });
});
