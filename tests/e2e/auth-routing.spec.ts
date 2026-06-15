import { expect, test } from "@playwright/test";

test("renders the login screen", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByText("AIFlashcards")).toBeVisible();
  await expect(page.getByText("Sign in to continue")).toBeVisible();
  await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

test("redirects unauthenticated protected routes to login", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("AIFlashcards")).toBeVisible();
});
