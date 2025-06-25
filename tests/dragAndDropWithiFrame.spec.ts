import { expect } from "@playwright/test";
import { test } from "../fixtures/testOptions";
test("Drag and drop with iFrame", async ({ page, globalsQaURL }) => {
  await page.goto(globalsQaURL);
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');
  // Approach 1
  await frame
    .locator("li", { hasText: "High Tatras 2" })
    .dragTo(frame.locator("#trash"));

  // Approach 2: more precise mouse controlling drag and drop
  await frame.locator("li", { hasText: "High Tatras 4" }).hover();
  await page.mouse.down(); // to click the mouse
  await frame.locator("#trash").hover();
  await page.mouse.up(); // to release the mouse

  await expect(frame.locator("#trash li h5")).toHaveText([
    "High Tatras 2",
    "High Tatras 4",
  ]);
});
