import {Locator, Page} from "@playwright/test";

export class MainPage {
    /** @type {import('@playwright/test').Page} */
    page;
    /** @type {import('@playwright/test').Locator} */
    composeButton;
    /** @type {import('@playwright/test').Locator} */
    composeRegion;
    /** @type {import('@playwright/test').Locator} */
    recipientsInput;
    /** @type {import('@playwright/test').Locator} */
    subjectInput;
    /** @type {import('@playwright/test').Locator} */
    messageInput;
    /** @type {import('@playwright/test').Locator} */
    sendButton;
    /** @type {import('@playwright/test').Locator} */
    alertDialog;
    /** @type {import('@playwright/test').Locator} */
    menuitemDelete;
    /** @type {import('@playwright/test').Locator} */
    menuitemMarkAsRead;
    /** @type {import('@playwright/test').Locator} */
    menuitemMarkAsUnread;
    /** @type {import('@playwright/test').Locator} */
    menuitemForward;

    constructor(page) {
        this.page = page;
        this.composeButton = this.page.getByRole('button', {name: 'Compose'});
        this.composeRegion = this.page.getByRole('region', {name: 'New Message'});
        this.recipientsInput = this.page.getByRole('combobox', {name: 'To recipients'});
        this.subjectInput = this.composeRegion.getByPlaceholder('Subject');
        this.messageInput = this.composeRegion.getByRole('textbox', {name: 'Message Body'});
        this.sendButton = this.page.getByRole('button', {name: /Send.*Enter/i});
        this.alertDialog = this.page.getByRole('alertdialog');
        this.menuitemDelete = this.page.getByRole('menuitem', {name: 'Delete'});
        this.menuitemMarkAsRead = this.page.getByRole('menuitem', {name: 'Mark as read'});
        this.menuitemMarkAsUnread = this.page.getByRole('menuitem', {name: 'Mark as unread'});
        this.menuitemForward = this.page.getByRole('menuitem', {name: 'Forward', exact: true});
    }

    async goto() {
        await this.page.goto('/');
    }

    async sendEmail(to, subject = "", message) {
        await this.composeButton.click();
        await this.recipientsInput.fill(to);
        if (subject !== "") {
            await this.subjectInput.fill(subject);
        }
        await this.messageInput.fill(message);
        await this.sendButton.click();
    }

    async forwardEmail(email, to) {
        await email.click({ button: 'right' });
        await this.menuitemForward.click();
        await this.recipientsInput.fill(to);
        await this.sendButton.click();
    }

    async getMessageBySubject(subject) {
        return this.page.locator('tr', { hasText: subject }).last();
    }
}
