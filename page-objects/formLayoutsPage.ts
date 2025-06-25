import { HelperBase } from "./helperBase";
import { Page } from "@playwright/test";

export class FormLayoutsPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async submitUsingGridFormWithCredentialsAndSelectOption(
    email: string,
    password: string,
    optionText: string
  ) {
    const usingGridForm = this.page.locator("nb-card", {
      hasText: "Using the Grid",
    });
    await usingGridForm.getByRole("textbox", { name: "Email" }).fill(email);
    await usingGridForm
      .getByRole("textbox", { name: "Password" })
      .fill(password);
    await usingGridForm
      .getByRole("radio", { name: optionText })
      .check({ force: true });
    await usingGridForm.getByRole("button").click();
  }

  /**
   * This method fill out InlineForm with user details
   * @param name should be first and last name
   * @param email valid email
   * @param checkbox true or false if user session to be saved
   */
  async submitInlineFormWithNameEmailAndCheckbox(
    name: string,
    email: string,
    checkbox: boolean
  ) {
    const inlineForm = this.page.locator("nb-card", {
      hasText: "Inline form",
    });
    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email);
    if (checkbox) {
      await inlineForm.getByRole("checkbox").check({ force: true });
    }
    await inlineForm.getByRole("button").click();
  }
}
