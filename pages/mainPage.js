import { Locator, Page } from "@playwright/test";

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
    /** @type {import('@playwright/test').Locator} */
    /** @type {import('@playwright/test').Locator} */
    /** @type {import('@playwright/test').Locator} */
    /** @type {import('@playwright/test').Locator} */
    /** @type {import('@playwright/test').Locator} */
    /** @type {import('@playwright/test').Locator} */
    /** @type {import('@playwright/test').Locator} */
    /** @type {import('@playwright/test').Locator} */

    constructor(page) {
        this.page = page;
        this.composeButton = page.getByRole('button', { name: 'Compose' });
        this.composeRegion = page.getByRole('region', { name: 'New Message' });
        this.recipientsInput = this.composeRegion.getByRole('combobox', { name: 'To recipients' });
        this.subjectInput = this.composeRegion.getByPlaceholder('Subject');
    }

    async goto() {
        await this.page.goto('/');
    }

    async sendEmail(to, message, subject = "") {
        await this.composeButton.click();
    }
}
