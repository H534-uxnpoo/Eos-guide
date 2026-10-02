import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync(new URL('../EOS_GUIDE_v015_Interactive_Visual_Update/eos-guide-data-v0.15.json', import.meta.url), 'utf8'));

test('legacy keyboard article moves to the keyboard screen with the original image and shortcuts', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => localStorage.setItem('eos-guide:favorites', JSON.stringify(['1_4'])));
  await page.goto('/#/guide/1_4');

  await expect(page).toHaveURL(/#\/keyboard$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Eosキーボード' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'キーボード配置画像' })).toBeVisible();
  const image = page.getByRole('img', { name: 'Eosキーボード全体とPCキーボードの対応' });
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate(element => element.naturalWidth)).toBe(1354);
  await expect(page.locator('.pc-shortcuts')).toContainText('Alt＋4');
  await expect(page.locator('.pc-shortcuts')).toContainText('Ctrl＋Q');
  await expect(page.locator('.key-grid button')).toHaveCount(19);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('eos-guide:favorites'))).toBe('[]');
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).resolves.toBeTruthy();

  await page.goto('/#/category/start');
  await expect(page.getByText('キーの配置', { exact: true })).toHaveCount(0);
  await page.goto('/#/search');
  await page.getByLabel('キー名・操作名・キーワード').fill('キーの配置');
  await expect(page.getByText('該当する記事がありません')).toBeVisible();
});

test('all remaining published articles open at 320px without runtime errors or page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

  for (const article of data.articles) {
    await page.goto(`/#${article.route}`);
    await expect(page.getByRole('heading', { level: 1, name: article.title, exact: true })).toBeVisible();
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).resolves.toBeTruthy();
  }
  expect(errors).toEqual([]);
});
