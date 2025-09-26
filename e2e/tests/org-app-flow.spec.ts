import { test } from '@playwright/test';
import { GlobalFullPage } from '../pages/GlobalFullpage';


test("Verify if configuration is rendered in Global Full Page", async ({ page }) => {
    const appName = process.env.ORG_APP_NAME || 'E2E Org App';
    const pageUrl = process.env.ENV_URL as string;
    await page.goto(pageUrl);
    await page.getByRole('link', { name: appName }).click();
    
    await page.waitForLoadState('networkidle');
    
    const globalApp = new GlobalFullPage(page);
    await globalApp.connectToIframe();
    await globalApp.validateInputContainer();
    await globalApp.showJsonCta();
    await globalApp.validateConfigValue();
  });
  
