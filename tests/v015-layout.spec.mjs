import { test, expect } from '@playwright/test';

test('v0.15 visuals remain legible at desktop, tablet, and narrow phone widths', async ({ page }) => {
  const sizes = [
    { name: 'desktop', width: 1440, height: 1100, columns: 4 },
    { name: 'tablet', width: 768, height: 1024, columns: 2 },
    { name: 'phone-320', width: 320, height: 780, columns: 1 },
  ];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

  for (const size of sizes) {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto('/#/guide/11_2');
    const workflow = page.locator('.workflow-grid');
    await expect(workflow.locator('button')).toHaveCount(8);
    const colCount = await workflow.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(colCount).toBe(size.columns);
    await page.screenshot({ path: `test-results/v015-${size.name}-cue-workflow.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }

  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/#/guide/1_5');
  await expect(page.locator('.glossary-grid button')).toHaveCount(12);
  await page.locator('.glossary-grid button').filter({ hasText: 'Parameter' }).click();
  await expect(page.locator('.glossary-definition')).toContainText('操作項目');
  await page.goto('/#/guide/7_1');
  await expect(page.locator('.mode-live')).toBeVisible();
  await expect(page.locator('.mode-blind')).toBeVisible();
  await page.goto('/#/guide/8_11');
  const fan = page.locator('.graph-scroll svg polyline');
  const pointsBefore = await fan.getAttribute('points');
  await page.locator('.fan-controls input[type=range]').fill('50');
  await expect(fan).not.toHaveAttribute('points', pointsBefore);
  await expect(page.locator('.offset-results i')).toHaveCount(18);
  await page.goto('/#/guide/12_1');
  await page.locator('.submaster-inputs input').nth(0).fill('100');
  await expect(page.locator('.submaster-results')).toContainText('100%');
  await page.locator('.submaster-inputs input').nth(1).fill('0');
  await expect(page.locator('.submaster-results article').nth(1)).toContainText('B');
  await page.goto('/#/guide/13_1');
  await page.locator('.effect-choices button').nth(2).click();
  await expect(page.locator('.effect-result-area')).toContainText('Focus');
  await expect(page.locator('.effect-description-area')).toContainText('Pan');
  expect(errors).toEqual([]);
});


