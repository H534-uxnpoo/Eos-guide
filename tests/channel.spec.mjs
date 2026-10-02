import { test, expect } from '@playwright/test';
test('channel article and redirects render', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  await page.setViewportSize({width:320,height:740});
  await page.goto('/#/guide/8_1');
  await expect(page.getByRole('heading',{level:1,name:'灯体（Channel）の選択と操作'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Sneak、Clear、Releaseの違い'})).toBeVisible();
  await page.goto('/#/guide/8_2'); await expect(page).toHaveURL(/#\/guide\/8_1$/);
  await page.goto('/#/guide/8_3'); await expect(page).toHaveURL(/#\/guide\/8_1$/);
  expect(errors).toEqual([]);
});
