import { expect, test } from "@playwright/test";

import { PageManager } from "../page-objects/pageManager";
import { argosScreenshot } from "@argos-ci/playwright";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("/");
});

test("Navigate to form page @smoke @regression", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datepickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("Parameterizes methods @ smoke", async ({ page }) => {
  const pm = new PageManager(page);
  // faker method return a random name:
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(
    1000
  )}@test.com`;

  await pm.navigateTo().formLayoutsPage();
  await pm
    .onFormLayoutsPage()
    .submitUsingGridFormWithCredentialsAndSelectOption(
      process.env.USERNAME,
      process.env.PASSWORD,
      "Option 1"
    );

  await page.screenshot({ path: "screenshots/formLayoutsPage.png" });

  // store a screenshot into binary when we need with integration with differen services:
  const buffer = await page.screenshot();
  // console.log(buffer.toString("base64"));

  await pm
    .onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      randomFullName,
      randomEmail,
      true
    );
  await page
    .locator("nb-card", {
      hasText: "Inline form",
    })
    .screenshot({ path: "screenshots/inlineForm.png" });
  await pm.navigateTo().datepickerPage();
  await pm.onDatePcikerPage().selectComonDatePickerDateFromToday(10);
  await pm.onDatePcikerPage().selectDatePickerWithRangeFromToday(1, 4);
});

test.only("Testing with Argos CI", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await argosScreenshot(page, "form layouts page");
  await pm.navigateTo().datepickerPage();
  await argosScreenshot(page, "datepicker page");
});
