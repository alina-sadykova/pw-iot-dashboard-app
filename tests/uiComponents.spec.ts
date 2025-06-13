import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form Layouts Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("Input fields", async ({ page }) => {
    const usingGridEmailInput = page
      .locator("nb-card", { hasText: " Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    await usingGridEmailInput.fill("test@test.com");
    await usingGridEmailInput.clear();

    /* Another way of typing is simulating key strokes and setting how fast it can be typed*/
    await usingGridEmailInput.pressSequentially("test2@test.com", {
      delay: 500,
    });

    /* generic assertion: 
    - methods inputValue extract text from input and save into our variable
    */
    const inputValue = await usingGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    /* locator assertion */
    await expect(usingGridEmailInput).toHaveValue("test2@test.com");
  });

  test("Radio buttons", async ({ page }) => {
    const usingGridEmailInput = page.locator("nb-card", {
      hasText: " Using the Grid",
    });

    /* SELECT RADIO OPTION 1: way 1*/
    // await usingGridEmailInput.getByLabel("Option 1").check({ force: true });

    /* SELECT RADIO OPTION 1: way 2*/
    await usingGridEmailInput
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });

    /* Validate that the radio was checked:
    - generic assertion
    - isCheck() will check status and return boolean
    */
    const radioStatus = await usingGridEmailInput
      .getByRole("radio", { name: "Option 1" })
      .isChecked();
    expect(radioStatus).toBeTruthy();

    /* Validate that the radio was checked 
    - locator assertion
    */
    await expect(
      usingGridEmailInput.getByRole("radio", { name: "Option 1" })
    ).toBeChecked();

    /* SELECT RADIO OPTION 2*/
    await usingGridEmailInput
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });

    expect(
      await usingGridEmailInput
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy();

    expect(
      await usingGridEmailInput
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy();
  });
});

test("Checkbox", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  /* CHECKBOX:
    click() vs check():
    - check() will validate the status of checkbox and check even if it was previously checked, it will not uncheck it.
    - click() doesnt validate the status.
    !!! Use uncheck() to uncheck.
  */
  await page
    .getByRole("checkbox", { name: "Hide on click" })
    .uncheck({ force: true });
  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true });

  const allBoxes = page.getByRole("checkbox");

  for (const box of await allBoxes.all()) {
    await box.check({ force: true });
    expect(await box.isChecked()).toBeTruthy();
  }

  for (const box of await allBoxes.all()) {
    await box.uncheck({ force: true });
    expect(await box.isChecked()).toBeFalsy();
  }
});

test("Lists and Dropdowns", async ({ page }) => {
  const dropdownMenu = page.locator("ngx-header nb-select");
  await dropdownMenu.click();

  page.getByRole("list"); // when list has a UI tag
  page.getByRole("listitem"); // when list has LI tag

  //   const optionList = page.getByRole("list").locator(".nb-option");
  const optionList = page.locator("nb-option-list nb-option");

  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  await optionList.filter({ hasText: "Cosmic" }).click();

  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  await dropdownMenu.click();
  for (const color in colors) {
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
    if (color !== "Corporate") await dropdownMenu.click();
  }
});

test("Tooltips", async ({ page }) => {
  /* Identify the locator in inspector:
    1. go to sources => hover over tooltip => press command + \ to freeze
    2. go to elements and find the element.
    */
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const tooltipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });

  await tooltipCard.getByRole("button", { name: "Top" }).hover();
  page.getByRole("tooltip"); // if you have a role tooltip created

  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("Dialog box", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // use event listener .on() to accept dialog box that pop up before deleting a table row
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();

  await expect(page.locator("table tr").first()).not.toHaveText(
    "mdo@gmail.com"
  );
});

test("Web tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1) get the row by any test in this row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("35");
  await page.locator(".nb-checkmark").click();

  // 2) get the row based on the value in the specific column
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowById.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").clear();
  await page
    .locator("input-editor")
    .getByPlaceholder("E-mail")
    .fill("test@test.com");
  await page.locator(".nb-checkmark").click();
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");

  // 3) test filter of the table
  const ages = ["20", "30", "40", "200"];

  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);

    await page.waitForTimeout(500);

    const ageRows = page.locator("tbody tr");
    for (let row of await ageRows.all()) {
      const cellValue = await row.locator("td").last().textContent();

      if (age == "200") {
        expect(await page.getByRole("table").textContent()).toContain(
          "No data found"
        );
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});
