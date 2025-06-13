import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();

  /* Another way to overwrite default timeout value for every test in this suite:
    access existing default value of timeout and increase it for lets say 2s
  */
  testInfo.setTimeout(testInfo.timeout + 2000);
});

test("Auto waiting", async ({ page }) => {
  /* Action Timeout (30 seconds) based on tetst timeout which is 30s.
  Playwright waits up to 30 seconds (default for Action timeout) for element to be visible, attached, and stable.
  for Full operations like click/load.
  Applied to click(), goto(), fill().
  BAD example: await page.waitForTimeout(30000); // waits 30s no matter what
  GOOD example: await page.waitForSelector('.loaded'); // waits up to timeout
  Customize timeput per action: await page.click('button', { timeout: 5000 }); // 5-second wait max
  Customize timeout for entire test:
        test('my test', async ({ page }) => {
        page.setDefaultTimeout(10000); // 10 seconds for all actions
        });
  */

  const successButton = page.locator(".bg-success");

  // // EXAMPLE 1 ------click() is waiting

  //   await successButton.click();

  /* override locally:
  await successButton.click({ timeout: 5000 });
  */

  // // EXAMPLE 2 -------textContent() is waiting for the button to be available to grab the text from the page
  const textContent = await successButton.textContent();
  expect(textContent).toEqual("Data loaded with AJAX get request.");

  // // EXAMPLE 3 --------allTextContents() does not wait, so we can create our own wait
  await successButton.waitFor({ state: "attached" });
  const allTextContents = await successButton.allTextContents();
  expect(allTextContents).toContain("Data loaded with AJAX get request.");

  // // EXAMPLE 4 --------locator assertion wait for 5 secons (default) so we can override by adding timeout
  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test("Alternative waits", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  // Wait 1 ____ wait for element
  //   await page.waitForSelector(".bg-success");

  // Wait 2 ____ wait for partuclar response
  await page.waitForResponse("http://uitestingplayground.com/ajax");

  // Wait 3 ____ wait for network calls to be completed (NOT RECOMMENDED)
  //   await page.waitForLoadState("networkidle");

  // Wait 4 ____ wait hardcoded (NOT A GOOD APPROACH)
  //   await page.waitForTimeout(5000);

  // Wait 5 ____ wait for partuclar URL to be loaded
  //   await page.waitForURL("http://uitestingplayground.com/ajax");

  const allTextContents = await successButton.allTextContents();
  expect(allTextContents).toContain("Data loaded with AJAX get request.");
});

test("Timeouts", async ({ page }) => {
  /* PW has:
    - global timeout;
    - test timeout (has default of 30s!!!!);
    - action and navigation timeout
    */

  /* How to overwrite  test timeout  */
  //   test.setTimeout(10000);

  /* To allow our test more time for execution 
    slow() will increase three times of set timeout:
    timeout set in config file * 3
  */
  test.slow();

  const successButton = page.locator(".bg-success");

  /* Overwrite timeout for action in here or in config file */
  await successButton.click({ timeout: 16000 });
});
