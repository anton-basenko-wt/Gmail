export class BasePO {
    static async leftClick(locator) {
        await locator.click();
    }

    static async rightClick(locator) {
        await locator.click({ button: 'right' });
    }
}
