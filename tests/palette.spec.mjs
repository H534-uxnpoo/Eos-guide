import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync(new URL('../EOS_GUIDE_v016_Effect_Preview_Kana_Search_update/EOS_GUIDE_v016_Effect_Preview_Kana_Search_update/eos-guide-data-v0.15.json', import.meta.url), 'utf8'));

test('palette articles, images, key labels, and redirects render', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 320, height: 740 });

  for (const id of ['9_1', '9_3', '9_5']) {
    const article = data.articles.find(item => item.id === id);
    await page.goto(`/#${article.route}`);
    await expect(page.getByRole('heading', { level: 1, name: article.title, exact: true })).toBeVisible();
    const images = article.content_sections.filter(section => section.type === 'image');
    await expect(page.locator('[data-section-type="image"] img')).toHaveCount(images.length);
    for (const section of images) await expect(page.locator(`img[src="${section.src}"]`)).toBeVisible();
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).resolves.toBeTruthy();
  }

  await page.goto('/#/keyboard');
  const presetBinding = data.pc_keyboard.bindings.find(binding => binding.eos_key === 'Preset');
  await expect(page.locator('.pc-shortcuts')).toContainText(presetBinding.display);
  for (const [oldId, targetId] of [['9_2', '9_1'], ['11_6', '10_2']]) {
    await page.goto(`/#/guide/${oldId}`);
    await expect(page).toHaveURL(new RegExp(`#\\/guide\\/${targetId}$`));
  }
  expect(errors).toEqual([]);
});
