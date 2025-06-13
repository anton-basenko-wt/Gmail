export class BasePO {
    async static leftClick(locator) {
        await locator.click();
    }

    async static rightClick(locator) {
        await locator.click({ button: 'right' });
    }
}
