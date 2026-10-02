import { test, expect } from '@playwright/test';

test('10_2 absorbs Time article and 11_6 redirects', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/guide/10_2');
  await expect(page.getByRole('heading', { level: 1, name: '照明変化のTime' })).toBeVisible();
  const figure = page.locator('figure').filter({ has: page.locator('input[id$="-delay"]') });
  const bar = figure.locator('svg rect').nth(1);
  const before = await bar.getAttribute('width');
  await figure.locator('input').first().fill('4.2');
  await expect(bar).not.toHaveAttribute('width', before);
  await page.goto('/#/guide/11_6');
  await expect(page).toHaveURL(/#\/guide\/10_2$/);
  await expect(page.getByRole('heading', { level: 1, name: '照明変化のTime' })).toBeVisible();
  expect(errors).toEqual([]);
});
