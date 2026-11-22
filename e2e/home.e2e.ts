import { expect, test } from "@playwright/test";

test("shows the venue search on the home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("button", { name: "Search", exact: true }),
  ).toBeVisible();
});