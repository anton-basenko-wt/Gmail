import { test, expect } from './fixtures/persistentContext';
import { MainPage } from '../pages/mainPage';


test.describe('Gmail with context', () => {
    test.beforeEach(async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.goto();
    });

    test('should open Gmail and verify title', async ({ page }) => {
        await expect(page).toHaveTitle(/Gmail|Mail|Inbox/i);
    });
});
