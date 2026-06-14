import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockRefresh = vi.fn();
const mockSignUp = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
    },
  }),
}));

import { RegisterForm } from "./RegisterForm";

describe("RegisterForm", () => {
  beforeEach(() => {
    mockRefresh.mockReset();
    mockSignUp.mockReset();
  });

  it("shows password validation errors", async () => {
    const user = userEvent.setup();

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "abc");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 6 characters/i);
  });

  it("submits signup data and shows success message", async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ error: null, data: { user: { id: "1" } } });

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "abc123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(mockSignUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "abc123",
    }));
    expect(await screen.findByRole("status")).toHaveTextContent(/account created/i);
    expect(mockRefresh).toHaveBeenCalled();
  });
});
