import { Locator, Page } from "@playwright/test";

import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  readonly formLayoutsMenuItem: Locator;
  readonly datePickerMenuItem: Locator;
  readonly smartTableMenuItem: Locator;
  readonly toastrMenuItem: Locator;
  readonly tooltipMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.formLayoutsMenuItem = page.getByText("Form Layouts");
    this.datePickerMenuItem = page.getByText("Datepicker");
    this.smartTableMenuItem = page.getByText("Smart Table");
    this.toastrMenuItem = page.getByText("Toastr");
    this.tooltipMenuItem = page.getByText("Tooltip");
  }

  async formLayoutsPage() {
    await this.selectGroupMenyItems("Forms");
    await this.formLayoutsMenuItem.click();
    await this.waitForNumberOfSeconds(2);
  }

  async datepickerPage() {
    await this.selectGroupMenyItems("Forms");
    await this.datePickerMenuItem.click();
  }

  async smartTablePage() {
    await this.selectGroupMenyItems("Tables & Data");
    await this.smartTableMenuItem.click();
  }

  async toastrPage() {
    await this.selectGroupMenyItems("Modal & Overlays");
    await this.toastrMenuItem.click();
  }

  async tooltipPage() {
    await this.selectGroupMenyItems("Modal & Overlays");
    await this.tooltipMenuItem.click();
  }

  private async selectGroupMenyItems(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const expendedState = await groupMenuItem.getAttribute("aria-expanded");

    if (expendedState == "false") {
      await groupMenuItem.click();
    }
  }
}
