import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockSignInWithPassword = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  }),
}));

import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockRefresh.mockReset();
    mockSignInWithPassword.mockReset();
  });

  it("shows validation errors", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("submits credentials and redirects on success", async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockResolvedValue({ error: null });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret123",
    }));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("renders auth failures", async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockResolvedValue({ error: { message: "Invalid login" } });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Invalid login")).toBeInTheDocument();
  });
});
