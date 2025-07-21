import { PageManager } from "./../page-objects/pageManager";
import { StatsProgressBarService } from "./../src/app/@core/mock/stats-progress-bar.service";
import { test as base } from "@playwright/test";
import { environment } from "./../src/environments/environment.prod";

export type TestOptions = {
  globalsQaURL: string;
  formLayoutsPage: string;
  pageManager: PageManager;
};
export const test = base.extend<TestOptions>({
  /* storing URLs */
  globalsQaURL: ["", { option: true }],

  /* store our fixture into an array and pass options (auto: true) as second argument
    formsLayout fixture will be automatically run even before
    any other hooks and we do not pass our fixture into the spec file.
    
    formLayoutsPage: [
      async ({ page }, use) => {
        await page.goto("/");
        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();
        await use("");
      },
      { auto: true },
    ],
  */

  /* set up dependency between fixtures 
    1. Pass formLayoutsPage to PageManager
    2. pageManager will trigger formLayoutsPage first
    3.then pageManager will be initialized.
    */
  formLayoutsPage: async ({ page }, use) => {
    await page.goto("/");
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();

    /* SEQUENCE OF EXECUTION INSIDE FIXTURE: 
    anything before USE() block will be executed before running test as precodnition
    known as SETTING UP environment
    anything after USE() blick will work as a TEARDOWN and executed after the test is completed.
    */
    console.log("SETUP");
    await use("");
    console.log("TEARDOWN");
  },
  pageManager: async ({ page, formLayoutsPage }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
});
