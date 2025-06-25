import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntax rules", async ({ page }) => {
  // by tag name:
  page.locator("input");

  // by ID:
  page.locator("#inputEmail");

  // by class:
  page.locator(".shape-rectangle");

  // by attr:
  page.locator('[placeholder="Email');

  // by class value (full classname):
  page.locator('[class="input-full-width]');

  // combine different selectors:
  page.locator('.input[placeholder="Email"][nbinput]');

  // by XPath (NOT RECOMMENDED, NOT GOOD PRACTIE):
  page.locator('//*[@id="inputEmail"');

  // by partial text match:
  page.locator(':text("Using")');

  // by exact text match:
  page.locator(':text-is("Using the Grid")');
});

test("User facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();
  await page.getByPlaceholder("Jane Doe").click();
  await page.getByText("Using the Grid").click();
  await page.getByTestId("SignIn").click();
  await page.getByTitle("IoT Dashboard").click();
});
test("Locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 1")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

  // AVOID THIS METHOD:
  await page.locator("nb-card").nth(3).getByRole("button").click();
});

test("Locating parent elements", async ({ page }) => {
  // Targeting parent -> then look for child that has text
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  // Targeting parent -> locate child element
  await page
    .locator("nb-card", { has: page.locator("#inputEmail") })
    .getByRole("textbox", { name: "Email" })
    .click();

  // using Playwright filter method: advantage is chaining multiple filters
  await page
    .locator("nb-card")
    .filter({ hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign In" })
    .getByRole("textbox", { name: "Password" })
    .click();

  // go up to parent using  XPath approach by locator("..") and find child element
  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Password" })
    .click();
});

test("Reusing locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });

  await emailField.fill("test@test.com");
  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("Extracting values", async ({ page }) => {
  // single text value: use textContent()
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent();

  expect(buttonText).toEqual("Submit");

  // get all text values in a list of array and check if there is a text Option 1
  const allRadioButtonsLabels = await page
    .locator("nb-radio")
    .allTextContents();
  expect(allRadioButtonsLabels).toContain("Option 1");

  // input value - inputValue() to grab a text inside input
  // attribute value - getAttribute('name') which access the value
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("test@test.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});

test("Assertions", async ({ page }) => {
  const basicFormButton = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .locator("button");

  /* GENERAL ASSERTION: has no wait time. 
  It pairs VALUE on the left (argument asserted) with value on 
  the right (expectation)*/
  const value = 5;
  expect(value).toEqual(5);

  const text = await basicFormButton.textContent();
  expect(text).toEqual("Submit");

  /* LOCATOR ASSERTION and Locator Assertion Timeout (5 seconds): 
  has its wait time for up to 5 sec (Quick checks like visibility/text)
  for a web element to be available for intraction.
  Applied to EXPECT only for locator asseretion like in expect(locator).toBeVisible().
  
  How it works? toHaveText() method search for text inside 
  our locator. When it finds it, it will make an assertion.*/
  await expect(basicFormButton).toHaveText("Submit");
  /* Override:
  await expect(locator).toHaveText('Submit', { timeout: 10000 }); // 10s
  */

  /* SOFT ASSERTION: test can be continued even when assertion failed.
  If 'Submit2' text, it will fail, but button still be clicked.
  NOT GOOD PRACTICE!
  */
  await expect.soft(basicFormButton).toHaveText("Submit");
  await basicFormButton.click();
});
