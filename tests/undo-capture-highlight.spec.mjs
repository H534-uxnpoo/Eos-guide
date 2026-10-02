import { test, expect } from '@playwright/test';
test('undo capture highlight article renders', async ({ page }) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  await page.setViewportSize({width:320,height:740}); await page.goto('/'); await page.evaluate(async()=>{for(const r of await navigator.serviceWorker?.getRegistrations?.() ?? []) await r.unregister();}); await page.goto('/#/guide/8_7');
  await expect(page.getByRole('heading',{level:1,name:'Undo・Capture・Highlight'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Undoの手順'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Captureの操作'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Highlightの手順'})).toBeVisible();
  await expect(page.locator('body')).toContainText('Ctrl＋X'); await expect(page.locator('body')).toContainText('Ctrl＋Alt＋P'); await expect(page.locator('body')).toContainText('Alt＋4');
  await page.goto('/#/guide/8_8'); await expect(page).toHaveURL(/#\/guide\/8_7$/);
  await page.goto('/#/guide/8_10'); await expect(page).toHaveURL(/#\/guide\/8_7$/);
  expect(errors).toEqual([]);
});
