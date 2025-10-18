/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');

  
describe('Cookbook - Keyboard Events', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Keyboard-Events/index.html');
    });

 
    it('Should display "alert" after pressing key', async () => {
        let result = false;
        page.on('dialog', async (dialog) => {
            result = true;
            await dialog.dismiss();
            await expect(result).toBe(true);
        });
        await page.keyboard.press('a');
    });
});