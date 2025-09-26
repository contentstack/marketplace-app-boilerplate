import { expect, Frame, Page } from "@playwright/test";

export class GlobalFullPage {
  readonly page: Page;
  private frame: Frame | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  async connectToIframe() {
    await this.page.waitForSelector('[data-testid="app-extension-frame"]');
    const frameElementHandle = await this.page.waitForSelector('[data-testid="app-extension-frame"]');
    this.frame = await frameElementHandle.contentFrame();
    
    if (!this.frame) {
      throw new Error("Failed to connect to app extension iframe");
    }
    
    await this.frame.waitForSelector(".layout-container");
    await this.frame.waitForSelector(".input-container");
  }

  async validateInputContainer() {
    if (!this.frame) throw new Error("Frame not connected");
    
    const inputContainer = this.frame.locator(".input-container .config-value");
    await expect(inputContainer).toHaveText("sample apps");
  }

  async showJsonCta() {
    if (!this.frame) throw new Error("Frame not connected");
    
    await this.frame.locator('img[alt="Show-Json-CTA"]').click();
    await this.frame.waitForSelector(".modal-overlay");
  }

  async validateConfigValue() {
    if (!this.frame) throw new Error("Frame not connected");
    
    const modal = this.frame.locator(".modal");
    await expect(modal).toBeVisible();
    
    const configText = this.frame.locator(".json-window pre");
    await expect(configText).toContainText("sample_app_configuration");
    await expect(configText).toContainText("sample apps");
    
    await this.frame.locator('.header-container img[alt="close"]').click();
    await expect(modal).not.toBeVisible();
  }
}
