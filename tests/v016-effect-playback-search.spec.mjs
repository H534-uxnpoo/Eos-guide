import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync(new URL('../EOS_GUIDE_v016_Effect_Preview_Kana_Search_update/EOS_GUIDE_v016_Effect_Preview_Kana_Search_update/eos-guide-data-v0.15.json', import.meta.url), 'utf8'));
const noPageOverflow = page => expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();

test('Step Based preview follows the preserved timeline inputs and playback controls', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/guide/13_3');
  const timeline = page.locator('.step-timeline');
  await expect(timeline.locator('.timeline-lane')).toHaveCount(6);
  await expect(timeline.locator('.effect-fixture-row li')).toHaveCount(6);
  await expect(timeline.locator('.timeline-svg')).toBeVisible();

  const firstFixture = timeline.locator('.effect-fixture-row li').first().locator('.fixture-orb');
  const initialColor = await firstFixture.evaluate(element => getComputedStyle(element).backgroundColor);
  await timeline.getByRole('button', { name: '灯体プレビューを再生' }).click();
  await expect.poll(async () => Number((await timeline.locator('.effect-current-time').innerText()).match(/[\d.]+/)?.[0])).toBeGreaterThan(0);
  await expect.poll(() => firstFixture.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(initialColor);
  await timeline.getByRole('button', { name: '灯体プレビューを一時停止' }).click();
  const paused = await timeline.locator('.effect-current-time').innerText();
  await page.waitForTimeout(120);
  await expect(timeline.locator('.effect-current-time')).toHaveText(paused);
  await timeline.getByRole('button', { name: '灯体プレビューを先頭へ戻す' }).click();
  await expect(timeline.locator('.effect-current-time')).toContainText('0.0秒');

  await timeline.getByLabel('In Time').fill('0');
  await timeline.getByLabel('Dwell Time').fill('0');
  await timeline.getByLabel('Decay Time').fill('0');
  await expect(timeline.locator('.timeline-lane')).toHaveCount(6);
  await noPageOverflow(page);
  expect(errors).toEqual([]);
});

test('Absolute preview groups all fixtures, handles Bkgrd, and plays on a 320px viewport', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/guide/13_4');
  const preview = page.locator('.absolute-timeline');
  await expect(preview).toBeVisible();
  await expect(preview.locator('.effect-fixture-row li')).toHaveCount(6);
  await expect(preview.locator('.absolute-timeline-svg')).toBeVisible();
  await expect(preview.locator('.absolute-group-summary span')).toHaveCount(3);
  await preview.getByLabel('Grouping').fill('4');
  await expect(preview.locator('.absolute-group-summary span')).toHaveCount(4);
  await expect(preview.locator('.absolute-group-summary').first()).toContainText('CH 6・CH 7');
  await preview.getByLabel('Level').fill('Bkgrd');
  await expect(preview.locator('.fixture-orb')).toHaveCount(6);
  await preview.getByRole('button', { name: '灯体プレビューを再生' }).click();
  await expect.poll(async () => Number((await preview.locator('.effect-current-time').innerText()).match(/[\d.]+/)?.[0])).toBeGreaterThan(0);
  await preview.getByRole('button', { name: '灯体プレビューを一時停止' }).click();
  await preview.getByRole('button', { name: '灯体プレビューを先頭へ戻す' }).click();
  await expect(preview.locator('.effect-current-time')).toContainText('0.0秒');
  await noPageOverflow(page);
  expect(errors).toEqual([]);
});

test('kana-normalized search keeps English, kanji, and katakana matches', async ({ page }) => {
  const cases = [
    ['Effect', '13_1'],
    ['effect', '13_1'],
    ['エフェクト', '13_1'],
    ['えふぇくと', '13_1'],
    ['マジックシート', '14_1'],
    ['まじっくしーと', '14_1'],
    ['パッチ', '5_3'],
    ['ぱっち', '5_3'],
  ];
  await page.goto('/#/search');
  for (const [query, id] of cases) {
    await page.getByRole('searchbox').fill(query);
    await expect(page.locator(`.article-card a[href="#/guide/${id}"]`).first()).toBeVisible();
  }
});

test('v0.16 app uses the attached data set without dropping published articles', async ({ page }) => {
  expect(data.articles).toHaveLength(35);
  expect(data.hidden_articles).toHaveLength(34);
  await page.setViewportSize({ width: 320, height: 740 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const article of data.articles) {
    await page.goto(`/#${article.route}`);
    await expect(page.getByRole('heading', { level: 1, name: article.title, exact: true })).toBeVisible();
    await noPageOverflow(page);
  }
  expect(errors).toEqual([]);
});
