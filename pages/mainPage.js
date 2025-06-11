import { Locator, Page } from "@playwright/test";

export class MainPage {
    /** @type {import('@playwright/test').Page} */
    page;

    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/');
    }
}