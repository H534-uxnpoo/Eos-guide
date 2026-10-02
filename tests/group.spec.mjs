import { test, expect } from '@playwright/test';
test('group article renders image and key reference', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  await page.setViewportSize({width:320,height:740});
  await page.goto('/#/guide/8_4');
  await expect(page.getByRole('heading',{level:1,name:'Group'})).toBeVisible();
  await expect(page.locator('img[src="/assets/groups/group-list.png"]')).toBeVisible();
  await expect(page.locator('body')).toContainText('G＋G');
  await expect(page.locator('body')).toContainText('Delete');
  expect(errors).toEqual([]);
});
