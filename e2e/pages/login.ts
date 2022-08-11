import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly waitElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator('button:has-text("Log In"):visible');
    this.waitElement = page.locator('.PageTitle:has-text("Stacks"):visible');
  }

  async goto() {
    await this.page.goto("/#!/login");
  }

  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.page.locator("#email").fill(email);
    await this.page.locator("#password").fill(password);
    await this.loginButton.click();
    await this.waitElement.waitFor();
  }
}
