import { expect, test } from "@playwright/test";

test("Input fields", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name == "mobile") {
    await page.locator(".sidebar-toggle").click();
  }
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
  if (testInfo.project.name == "mobile") {
    await page.locator(".sidebar-toggle").click();
  }
  const usingGridEmailInput = page
    .locator("nb-card", { hasText: " Using the Grid" })
    .getByRole("textbox", { name: "Email" });

  await usingGridEmailInput.fill("test@test.com");
  await usingGridEmailInput.clear();
  await usingGridEmailInput.fill("test2@test2.com");
});
