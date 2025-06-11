import { test as base } from '@playwright/test';
import { chromium, firefox, webkit } from 'playwright';

export const test = base.extend({
    context: async ({ browserName }, use) => {
        const userDataDir = `./user-data-${browserName}`;
        const browserType = {
            chromium: chromium,
            firefox: firefox,
            webkit: webkit,
        }[browserName];

        const context = await browserType.launchPersistentContext(userDataDir);
        await use(context);
        await context.close();
    },

    page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
        await page.close();
    }
});

export { expect } from '@playwright/test';
