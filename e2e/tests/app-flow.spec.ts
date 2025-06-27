import { test, expect} from '@playwright/test';
import { AssetPage } from '../pages/AssetPage';

import { createContentType, createEntry, createApp, updateApp, installApp, assetUpload, uninstallApp, deleteApp, deleteContentType, entryPageFlow, initializeEntry, getExtensionFieldUid, deleteAsset, mockFetchPublicKey } from '../utils/helper';

const jsonFile = require('jsonfile');

let savedCredentials: any = {};
let authToken: string;

interface TestData {
  appId: string;
  contentTypeId: Object | any;
  installationId: string;
  authToken: string;
  entryTitle: string;
  environment: string;
  stackDetails: any;
  assetId: string;
}

//setting up the test data for entry page actions
test.beforeAll(async () => {
  const file = 'data.json';
  const token = jsonFile.readFileSync(file);
  authToken = token.authToken;
  try {
    if (authToken) {
      const appId: string = await createApp(authToken);
      await updateApp(authToken, appId);
      const uploadedAsset = await assetUpload(process.env.STACK_API_KEY, authToken);
      savedCredentials['assetId'] = uploadedAsset.data.asset.uid;
      const installationId: string = await installApp(authToken, appId, process.env.STACK_API_KEY);
      const extensionUid = await getExtensionFieldUid(authToken);
      const contentTypeResp = await createContentType(authToken, extensionUid);
      savedCredentials['contentTypeId'] = extensionUid ? contentTypeResp.content_type.uid : undefined;
      if (contentTypeResp.notice === 'Content Type created successfully.') {
        const entryResp = await createEntry(authToken, contentTypeResp.content_type.uid);
        savedCredentials['entryUid'] = entryResp.entry.uid;
        savedCredentials['entryTitle'] = entryResp.entry.title;
        savedCredentials['appId'] = appId;
        savedCredentials['installationId'] = installationId;
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
});

//tearing down of test data
test.afterAll(async () => {
  const addParams: TestData = savedCredentials;
  if (addParams.installationId) await uninstallApp(authToken, addParams.installationId);
  await deleteApp(authToken, addParams.appId);
  if (addParams.contentTypeId) {
    await deleteContentType(authToken, addParams.contentTypeId);
    await deleteAsset(authToken, addParams?.assetId);
  } else {
    throw new Error('Content Type not created');
  }
});

test('Verify Dashboard Widget', async ({ page, context }) => {
  const entryPage = await initializeEntry(page);
  await entryPage.navigateToDashboard();
  await entryPage.validateDashboardWidget();
});

test('Verify Custom Field & Entry Sidebar', async ({ page, context }) => {
  const entryPage = await initializeEntry(page);
  await entryPageFlow(savedCredentials, entryPage);
  await entryPage.validateCustomField();
});

test('Verify Asset Sidebar', async ({ page, context }) => {
  const { assetId } = savedCredentials;
  const assetPage = new AssetPage(page);
  await assetPage.validateAssetSideBar(assetId);
});

test.skip("Verify if custom-field is loading for valid AppToken", async ({ page, context }) => {
  const entryPage = await initializeEntry(page);
  await entryPageFlow(savedCredentials, entryPage);
  await mockFetchPublicKey(context, true);

  // Mocking a valid token
  await page.evaluate(() => {
    window.localStorage.setItem("app_token", "VALID_JWT_TOKEN");
  });

  await page.reload();

  // Expect the validateCustomField function to be called
  await entryPage.validateCustomField();
});

test("Verify if AppFailed component is displayed for Invalid AppToken", async ({ page, context }) => {
  const entryPage = await initializeEntry(page);
  await entryPageFlow(savedCredentials, entryPage);
  await mockFetchPublicKey(context, false);

  // Mocking an invalid token
  await page.evaluate(() => {
    window.localStorage.setItem("app_token", "INVALID_JWT_TOKEN");
  });

  await page.reload();

  // Expect the AppFailed component to be visible
  const isErrorDisplayed = await entryPage.validateCustomFieldWithInvalidJWTToken();
  expect(isErrorDisplayed).toBeTruthy();
});
