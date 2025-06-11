import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/mainPage';

let context;
/** @type {import('@playwright/test').Page} */
let page;
let mainPage;

test.describe('Gmail with persistent context', () => {
    test.beforeEach(async ({ browserName }) => {
        const userDataDir = `./user-data${browserName}`;
        const browserType = {
            chromium: require('playwright').chromium,
            firefox: require('playwright').firefox,
            webkit: require('playwright').webkit,
        }[browserName];

        context = await browserType.launchPersistentContext(userDataDir);
        /* run not headless for the first time to manually sign in:
            comment the line above
            uncomment the line below as well as await page.waitForTimeout(30000);
         */
        // context = await browserType.launchPersistentContext(userDataDir, { headless: false });

        page = await context.newPage();
        mainPage = new MainPage(page);
        await mainPage.goto();
        // await page.waitForTimeout(30000);
    });

    test.afterEach(async () => {
        await context.close();
    });

    test('should open Gmail and verify title', async () => {
        await expect(page).toHaveTitle(/Gmail|Mail|Inbox/i);
    });
});
