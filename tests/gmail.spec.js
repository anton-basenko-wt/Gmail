import { test, expect } from './fixtures/persistentContext';
import { MainPage } from '../pages/mainPage';
import { BasePO } from '../pages/basePO';
import { generateHash } from "../utils/commands";

/** @type {import('../pages/mainPage').MainPage}*/
let mainPage;
let emailAddress = 'hello.there.pw@gmail.com';
const text = 'Hello there!';

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
        await BasePO.leftClick(mainPage.composeButton);
        await expect(mainPage.composeRegion).toBeVisible();
    });

    test('should close compose region', async ({ page }) => {
        await BasePO.leftClick(mainPage.composeButton);
        await BasePO.leftClick(mainPage.saveAndCloseButton);
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
        await mainPage.sendEmail(emailAddress, '', '');
    });

    test('should send email to self', async ({ page }) => {
        // 7-digit long hexadecimal hash
        const randomSubject = generateHash(7);
        await mainPage.sendEmail(emailAddress, randomSubject, text);
        const message = mainPage.getMessageBySubject(randomSubject);
        await expect(message).toBeVisible();
        // message should contain the start of the text
        await expect(message).toContainText(text.length > 10 ? text.substring(10) : text);
    });

    test('should delete message', async ({ page }) => {
        // 7-digit long hexadecimal hash
        const randomSubject = generateHash(7);

        await test.step('send email', async ({ page }) => {
            await mainPage.sendEmail(emailAddress, randomSubject, text);
        });

        // get the message locator
        const message = mainPage.getMessageBySubject(randomSubject);
        await test.step('check that we received the message', async ({ page }) => {
            await expect(message).toBeVisible();
        });

        await test.step('delete the message', async({ page }) => {
            await BasePO.rightClick(message);
            await BasePO.leftClick(mainPage.menuitemDelete);
        });

        await test.step('check that the message is gone', async ({ page }) => {
            await expect(message).toBeHidden();
        });
    });

    test('should mark message as read', async ({ page }) => {
        // 7-digit long hexadecimal hash
        const randomSubject = generateHash(7);

        await test.step('send email', async ({ page }) => {
            await mainPage.sendEmail(emailAddress, randomSubject, text);
        });

        // get the message locator
        const message = mainPage.getMessageBySubject(randomSubject);
        await test.step('check its unread', async ({ page }) => {
            await expect(message).toContainText('unread');
        });

        await test.step('mark as read', async ({ page }) => {
            await BasePO.rightClick(message);
            await BasePO.leftClick(mainPage.menuitemMarkAsRead);
        });

        await test.step('check its read', async ({ page }) => {
            await expect(message).not.toContainText('unread');
        });
    });

    test('should mark message as unread', async ({ page }) => {
        // 7-digit long hexadecimal hash
        const randomSubject = generateHash(7);

        await test.step('send email', async ({ page }) => {
            await mainPage.sendEmail(emailAddress, randomSubject, text);
        });

        // get the message locator
        const message = mainPage.getMessageBySubject(randomSubject);
        await test.step('check its unread', async ({ page }) => {
            await expect(message).toContainText('unread');
        });

        await test.step('mark as read', async ({ page }) => {
            await BasePO.rightClick(message);
            await BasePO.leftClick(mainPage.menuitemMarkAsRead);
        });

        await test.step('mark as unread', async ({ page }) => {
            await BasePO.rightClick(message);
            await BasePO.leftClick(mainPage.menuitemMarkAsUnread);
        });

        await test.step('check its unread', async ({ page }) => {
            await expect(message).toContainText('unread');
        });
    });

    test('should forward message', async ({ page }) => {
        // 7-digit long hexadecimal hash
        const randomSubject = generateHash(7);

        await test.step('send email', async ({ page }) => {
            await mainPage.sendEmail(emailAddress, randomSubject, text);
        });

        // get the message locator
        const message = mainPage.getMessageBySubject(randomSubject);
        await test.step('mark as read', async ({ page }) => {
            await BasePO.rightClick(message);
            await BasePO.leftClick(mainPage.menuitemMarkAsRead);
        });

        await test.step('forward email', async ({ page }) => {
            await mainPage.forwardEmail(message, emailAddress);
        });

        // get the forwarded message locator
        const forwardedMessage = page.locator(
            'tr',
            { hasText: new RegExp(`${randomSubject}.*forwarded|forwarded.*${randomSubject}`, 'i') }
        ).last();
        await test.step('check we received forwarded message', async ({ page }) => {
            await expect(forwardedMessage).toBeVisible();
        });
    });

    test('should star email', async ({ page }) => {
        // 7-digit long hexadecimal hash
        const randomSubject = generateHash(7);

        await test.step('send email', async ({ page }) => {
            await mainPage.sendEmail(emailAddress, randomSubject, text);
        });

        // get the message locator
        const message = mainPage.getMessageBySubject(randomSubject);
        const notStarredButton = mainPage.getNotStarredButton(message);
        await test.step('check its not starred', async ({ page }) => {
            await expect(message).not.toContainText('starred');
        });

        await test.step('star email', async ({ page }) => {
            await BasePO.leftClick(notStarredButton);
        });

        await test.step('check its starred', async ({ page }) => {
            await expect(message).toContainText('starred');
        });
    });

    test('should unstar email', async ({ page }) => {
        // 7-digit long hexadecimal hash
        const randomSubject = generateHash(7);

        await test.step('send email', async ({ page }) => {
            await mainPage.sendEmail(emailAddress, randomSubject, text);
        });

        // get the message locator
        const message = mainPage.getMessageBySubject(randomSubject);
        const starredButton = mainPage.getStarredButton(message);
        const notStarredButton = mainPage.getNotStarredButton(message);
        await test.step('check its not starred', async ({ page }) => {
            await expect(message).not.toContainText('starred');
        });

        await test.step('star email', async ({ page }) => {
            await BasePO.leftClick(notStarredButton);
        });

        await test.step('unstar email', async ({ page }) => {
            await BasePO.leftClick(starredButton);
        });

        await test.step('check its not starred', async ({ page }) => {
            await expect(message).not.toContainText('starred');
        });
    });
});
