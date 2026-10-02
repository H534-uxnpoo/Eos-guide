import { test, expect } from '@playwright/test';
test('v0.14.1 PC commands render on updated articles', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  await page.setViewportSize({width:320,height:740});
  for (const id of ['1_4','3_1','8_1','11_2','13_6']) { await page.goto(`/#/guide/${id}`); await expect(page.locator('h1')).toBeVisible(); }
  await page.goto('/#/guide/1_4'); await expect(page.locator('body')).toContainText('Shift＋Backspace');
  await page.goto('/#/guide/3_1'); await expect(page.locator('body')).toContainText('Displays → File → Save As → USB名');
  await page.goto('/#/guide/13_6'); await expect(page.locator('body')).toContainText('Alt＋E');
  await page.goto('/#/guide/11_2'); await expect(page.locator('body')).toContainText('U → X → Enter');
  expect(errors).toEqual([]);
});
