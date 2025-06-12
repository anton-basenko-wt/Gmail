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

    constructor(page) {
        this.page = page;
        this.composeButton = this.page.getByRole('button', {name: 'Compose'});
        this.composeRegion = this.page.getByRole('region', {name: 'New Message'});
        this.recipientsInput = this.composeRegion.getByRole('combobox', {name: 'To recipients'});
        this.subjectInput = this.composeRegion.getByPlaceholder('Subject');
        this.messageInput = this.composeRegion.getByRole('textbox', {name: 'Message Body'});
        this.sendButton = this.page.getByRole('button', {name: /Send.*Enter/i});
        this.alertDialog = this.page.getByRole('alertdialog');
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

    async getMessageBySubject(subject) {
        return this.page.locator('tr', { hasText: subject }).last();
    }
}
