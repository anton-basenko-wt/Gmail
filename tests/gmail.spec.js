import { test, expect } from './fixtures/persistentContext';
import { MainPage } from '../pages/mainPage';
import { generateHash } from "../utils/hashGen";

/** @type {import('../pages/mainPage').MainPage}*/
let mainPage;
let email = 'hello.there.pw@gmail.com';

test.describe('Gmail with context', () => {
    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        await mainPage.goto();
    });

    test('should open Gmail and verify title', async ({ page }) => {
        await expect(page).toHaveTitle(/Gmail|Mail|Inbox/i);
    });

    test('should open compose region', async ({ page }) => {
        await expect(mainPage.composeRegion).toBeHidden();
        await mainPage.composeButton.click();
        await expect(mainPage.composeRegion).toBeVisible();
    });

    test('should close compose region', async ({ page }) => {
        await mainPage.composeButton.click();
        await page.getByRole('img', { name: 'Save & close' }).click();
        await expect(mainPage.composeRegion).toBeHidden();
    });

    test('should display error on sending email without recipient(s)', async ({ page }) => {
        await expect(mainPage.alertDialog).toBeHidden();
        await mainPage.sendEmail('', '', '');
        await expect(mainPage.alertDialog).toBeVisible();
    });

    test('should display warning on sending email without subject and text', async ({ page }) => {
        page.once('dialog', async dialog => {
            expect(dialog.message()).toMatch(/Send.*without.*subject.*text/i);
            await dialog.dismiss(); // или dialog.accept();
        });
        await mainPage.sendEmail(email, '', '');
    });

    test('should send email to self', async ({ page }) => {
        // 7-digit long hexadecimal hash
        const randomSubject = generateHash(7);
        const text = 'Hello there!';
        await mainPage.sendEmail(email, randomSubject, text);
        const message = await mainPage.getMessageBySubject(randomSubject);
        await expect(message).toBeVisible();
        // message should contain the start of the text
        await expect(message).toContainText(text.length > 10 ? text.substring(10) : text);
    });
});
