import { test, expect } from '@playwright/test';
test('palette articles and migrations render', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  await page.setViewportSize({width:320,height:740});
  await page.goto('/#/guide/9_5'); await expect(page.getByRole('heading',{level:1,name:'Color PaletteとPresetの作り方'})).toBeVisible();
  await expect(page.locator('img[src^="/assets/palettes/"]')).toHaveCount(5); await expect(page.locator('body')).toContainText('Alt＋P');
  await page.goto('/#/guide/9_2'); await expect(page).toHaveURL(/#\/guide\/9_1$/);
  await page.goto('/#/guide/11_6'); await expect(page).toHaveURL(/#\/guide\/10_2$/);
  expect(errors).toEqual([]);
});
