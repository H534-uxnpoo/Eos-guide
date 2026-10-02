import { test, expect } from '@playwright/test';

test('v0.9.2 interactive cue diagrams and merged cue routes', async ({ page }) => {
  page.on('pageerror', error => console.log('PAGEERROR', error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/guide/10_2');
  const timing = page.locator('figure').filter({ has: page.locator('input[id$="-delay"]') }).first();
  await expect(timing).toBeVisible();
  const bar = timing.locator('svg rect').nth(1);
  const before = await bar.getAttribute('width');
  await timing.locator('input').first().fill('4.2');
  await expect(bar).not.toHaveAttribute('width', before);
  await expect(timing.locator('[aria-live]')).toBeVisible();
  await page.goto('/#/guide/10_4');
  const follow = page.locator('figure').filter({ has: page.locator('input[id$="-follow"]') }).first();
  const marker = follow.locator('svg line').nth(-1);
  const followBefore = await marker.getAttribute('x1');
  await follow.locator('input').nth(1).fill('7.5');
  await expect(marker).not.toHaveAttribute('x1', followBefore);
  await page.goto('/');
  await page.goto('/#/guide/11_3');
  await expect(page).toHaveURL(/#\/guide\/11_2$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('画面図は準備中');
});
