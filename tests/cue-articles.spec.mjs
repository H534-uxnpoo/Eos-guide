import { test, expect } from '@playwright/test';

const routes = ['11_2', '11_6', '11_7', '11_8', '11_9', '11_10'];

test('Cue articles render without browser runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.stack || error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  for (const id of routes) {
    await page.goto(`/#/guide/${id}`);
    await page.waitForTimeout(300);
    console.log(id, await page.locator('body').innerText(), errors);
  }
  expect(errors).toEqual([]);
});
