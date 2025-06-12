import { test, expect } from './fixtures/persistentContext';
import { MainPage } from '../pages/mainPage';

/** @type {import('../pages/mainPage').MainPage}*/
let mainPage;

test.describe('Gmail with context', () => {
    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        await mainPage.goto();
    });

    test('should open Gmail and verify title', async ({ page }) => {
        await expect(page).toHaveTitle(/Gmail|Mail|Inbox/i);
    });

    test('should open compose region', async ({ page }) => {
        await expect(mainPage.composeRegion).toHaveCount(0);
        await mainPage.composeButton.click();
        await expect(mainPage.composeRegion).toBeVisible();
    });
});
