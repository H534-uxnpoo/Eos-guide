import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../EOS_GUIDE_v0.7_Magic_Sheet_update/eos-guide-data-v0.7.json', import.meta.url), 'utf8'));
const noOverflow = async page => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
test('12 categories, all published articles and keys; mobile layout and console', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('.category-tile')).toHaveCount(12);
  await noOverflow(page);
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  const seen = new Set();
  for (const button of data.ui_model.home_buttons) {
    await page.goto('/');
    await page.locator('.category-tile').filter({ has: page.getByRole('heading', { name: button.label, exact: true }) }).click();
    await expect(page.getByRole('heading', { level: 1, name: button.label, exact: true })).toBeVisible();
    if (button.id !== 'keyboard') {
      const articles = data.articles.filter(article => article.category_id === button.id);
      await expect(page.locator('.article-card')).toHaveCount(articles.length);
      for (const article of articles) seen.add(article.id);
    } else {
      await expect(page.locator('.key-grid button')).toHaveCount(11);
      for (const item of data.keyboard_index.filter(entry => data.articles.some(article => article.id === entry.article_id))) {
        await page.getByRole('button', { name: item.key, exact: true }).click();
        await expect(page.locator('#key-description h2')).toHaveText(item.key);
        await expect(page.locator('#key-description a')).toHaveAttribute('href', `#/guide/${item.article_id}`);
      }
    }
    await noOverflow(page);
  }
  expect(seen.size).toBe(data.articles.length);
  for (const article of data.articles) {
    await page.goto(`/#${article.route}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(article.title);
    await expect(page.locator('.source')).toContainText(String(article.source.page_start));
    await noOverflow(page);
  }
  await page.goto('/#/guide/3_1');
  await expect(page.getByRole('heading', { name: '操作手順', exact: true })).toHaveCount(0);
  await page.screenshot({ path: 'test-results/article-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/'); await noOverflow(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/'); await noOverflow(page);
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});
test('favorites persist and can be removed; malformed storage is tolerated', async ({ page }) => {
  await page.goto('/#/guide/3_1');
  const favorite = page.getByRole('button', { name: 'ショーファイルの保存をお気に入りに登録' });
  await favorite.click(); await page.reload();
  await expect(page.getByRole('button', { name: 'ショーファイルの保存をお気に入りから解除' })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/#/favorites'); await expect(page.locator('.article-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'ショーファイルの保存をお気に入りから解除' }).click();
  await page.reload(); await expect(page.getByText('お気に入りはまだありません')).toBeVisible();
  await page.evaluate(() => localStorage.setItem('eos-guide:favorites', '{broken'));
  await page.reload(); await expect(page.getByText('お気に入りはまだありません')).toBeVisible();
});
test('search, unknown article URLs, keyboard navigation and empty sections', async ({ page }) => {
  await page.goto('/#/search'); await page.getByRole('searchbox').fill('Ｓｎｅａｋ');
  await expect(page.locator('.article-card')).not.toHaveCount(0);
  await page.getByRole('searchbox').fill('存在しない検索xyz');
  await expect(page.getByText('該当する記事がありません')).toBeVisible();
  for (const path of ['/#/guide/missing', '/guide/missing', '/#/%invalid']) {
    await page.goto(path); await expect(page.getByRole('heading', { name: 'ページが見つかりません' })).toBeVisible();
  }
  await page.goto('/#/guide/1_4');
  await expect(page.getByRole('heading', { name: 'コマンド例', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '注意点', exact: true })).toHaveCount(0);
  await page.goto('/'); await page.keyboard.press('Tab');
  await expect(page.getByText('本文へ移動')).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused();
});
test('PWA precaches the app and data, and survives offline reloads', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { const registration = await navigator.serviceWorker.ready; if (!registration.active) throw new Error('No active service worker'); });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBeTruthy();
  const manifest = await page.evaluate(async () => { const link = document.querySelector('link[rel=manifest]'); return fetch(link.href).then(response => response.json()); });
  expect(manifest.icons).toHaveLength(2); expect(manifest.display).toBe('standalone');
  await context.setOffline(true);
  for (const route of ['/', '/#/category/channels', '/#/guide/13_6', '/#/keyboard', '/#/search', '/#/favorites']) {
    await page.goto(route); await expect(page.locator('h1')).toBeVisible(); await expect(page.getByText('オフライン', { exact: true })).toBeVisible();
  }
  await page.goto('/#/search'); await page.getByRole('searchbox').fill('保存'); await expect(page.locator('.article-card')).not.toHaveCount(0);
  await context.setOffline(false);
});

test('v0.2 published data, hidden articles, merged URLs and migrated favorites', async ({ page }) => {
  expect(data.articles).toHaveLength(51);
  expect(data.hidden_articles).toHaveLength(18);
  await page.goto('/');
  await expect(page.getByText('51 ARTICLES', { exact: true })).toBeVisible();
  for (const hidden of data.hidden_articles) {
    await page.goto('/#/category/' + hidden.category_id);
    await expect(page.locator('.article-card a[href="#/guide/' + hidden.id + '"]')).toHaveCount(0);
    await page.goto('/#/search');
    await page.getByRole('searchbox').fill(hidden.title);
    await expect(page.locator('.article-card a[href="#/guide/' + hidden.id + '"]')).toHaveCount(0);
    await page.goto('/#/guide/' + hidden.id);
    await expect(page.getByRole('heading', { name: 'ページが見つかりません' })).toBeVisible();
  }
  for (const [oldId, targetId] of [['5_2', '5_1'], ['12_2', '12_1'], ['12_3', '12_1']]) {
    for (const url of ['/#/guide/', '/guide/']) {
      await page.goto(url + oldId);
      await expect(page).toHaveURL(new RegExp('/#/guide/' + targetId + '$'));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(data.articles.find(article => article.id === targetId).title);
    }
  }
  await page.goto('/#/category/patch');
  await expect(page.locator('.article-card').getByRole('heading', { name: 'Patchとは・画面の見方', exact: true })).toHaveCount(1);
  await page.goto('/#/category/submaster');
  await expect(page.locator('.article-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Submasterの使い方', exact: true })).toBeVisible();
  await page.evaluate(() => localStorage.setItem('eos-guide:favorites', JSON.stringify(['3_1', '5_2', '5_1', '12_2', '12_3', '1_1', 'missing', null])));
  await page.goto('/#/favorites'); await page.reload();
  await expect(page.locator('.article-card')).toHaveCount(3);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('eos-guide:favorites')))).toEqual(['3_1', '5_1', '12_1']);
  await page.reload(); await expect(page.locator('.article-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Submasterの使い方をお気に入りから解除' }).click();
  await page.reload(); await expect(page.locator('.article-card')).toHaveCount(2);
});
test('PC shortcuts are distinct, accessible, linked and responsive', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/guide/11_3');
  const card = page.locator('section').filter({ has: page.getByRole('heading', { name: 'PCキーボード', exact: true }) });
  await expect(card.getByRole('group', { name: 'Go To Cue: Ctrl + Q → Cue番号 → Enter', exact: true })).toBeVisible();
  await expect(card.locator('kbd')).toHaveText(['Ctrl', 'Q', 'Cue番号', 'Enter']);
  await expect(card).toContainText('指定したCueへ移動する');
  await expect(page.getByRole('heading', { name: 'コマンド例', exact: true })).toBeVisible();
  await noOverflow(page);
  await page.screenshot({ path: 'test-results/pc-shortcut-mobile.png', fullPage: true });
  await page.goto('/#/keyboard');
  await expect(page.getByRole('heading', { name: 'PCキーボードショートカット' })).toBeVisible();
  await expect(page.locator('.shortcut-link')).toHaveCount(data.articles.reduce((total, article) => total + (article.keyboard_shortcuts?.length ?? 0), 0));
  await noOverflow(page);
  await page.locator('.shortcut-link').filter({ has: page.getByRole('heading', { name: 'Go To Cue', exact: true }) }).click();
  await expect(page).toHaveURL(/#\/guide\/11_3$/);
  await page.goto('/#/guide/3_1');
  await expect(page.getByRole('heading', { name: 'PCキーボード', exact: true })).toHaveCount(0);
});

test('v0.4 structured Effect articles and four images render offline', async ({ page, context }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/'); await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined)); await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBeTruthy();
  await context.setOffline(true);
  let images = 0;
  for (const article of data.articles.filter(article => /^13_[1-5]$/.test(article.id))) {
    await page.goto('/#' + article.route);
    for (const section of article.content_sections) {
      if (section.type === 'image') {
        const img = page.getByRole('img', { name: section.alt, exact: true });
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate(element => element.complete && element.naturalWidth > 0)).toBeTruthy();
        images++;
      } else {
        await expect(page.locator('[data-section-type="' + section.type + '"]').filter({ has: page.getByRole('heading', { name: section.title, exact: true }) })).toBeVisible();
      }
    }
    await expect(page.getByText('画面図は準備中', { exact: true })).toHaveCount(0);
    await noOverflow(page);
  }
  expect(images).toBe(4);
  await expect(page.getByText('公式情報による補足', { exact: true })).toHaveCount(2);
  await context.setOffline(false);
});
test('Step timeline timing, controls, zero durations, inversion and mobile scrolling', async ({ page }) => {
  const section = data.articles.find(article => article.id === '13_3').content_sections.find(section => section.type === 'step_timeline');
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/guide/13_3');
  const timeline = page.locator('.step-timeline');
  await expect(timeline.locator('input')).toHaveCount(section.editable.length);
  expect(await timeline.evaluate(element => element.previousElementSibling.querySelector('h2').textContent)).toBe('設定項目');
  await expect(timeline.locator('svg')).toHaveAccessibleName(/各時間の関係/);
  await expect(timeline.locator('svg')).toHaveAccessibleDescription(/チャンネル11: 2.5秒から開始/);
  await expect(timeline.locator('.timeline-note')).toHaveText(section.note);
  expect(await timeline.locator('.timeline-note').evaluate(element => element.previousElementSibling.className)).toBe('timeline-scroll');
  expect(await timeline.locator('.timeline-lane').evaluateAll(elements => elements.map(element => Number(element.dataset.start)))).toEqual([0, 0.5, 1, 1.5, 2, 2.5]);
  for (const [field, value] of Object.entries(section.defaults)) await expect(timeline.locator('input').nth(section.editable.indexOf(field))).toHaveValue(String(value));
  const line = timeline.locator('.timeline-lane').first().locator('.phase-in .level-line');
  const initial = await line.getAttribute('x2');
  await timeline.locator('input').nth(section.editable.indexOf('in_time')).fill('2');
  expect(await line.getAttribute('x2')).not.toBe(initial);
  await timeline.locator('input').nth(section.editable.indexOf('dwell_time')).fill('1.5');
  await timeline.locator('input').nth(section.editable.indexOf('decay_time')).fill('2');
  await expect(timeline.locator('.timeline-lane').first()).toHaveAttribute('data-end', '5.5');
  await timeline.locator('input').nth(section.editable.indexOf('step_time')).fill('0.1');
  const intervals = await timeline.locator('.timeline-lane').evaluateAll(elements => elements.map(element => [Number(element.dataset.start), Number(element.dataset.end)]));
  expect(intervals[5][0]).toBe(0.5); expect(intervals[0][1]).toBeGreaterThan(intervals[5][0]);
  await timeline.locator('input').nth(section.editable.indexOf('on_state')).fill('20');
  await timeline.locator('input').nth(section.editable.indexOf('off_state')).fill('80');
  expect(Number(await line.getAttribute('y1'))).toBeLessThan(Number(await line.getAttribute('y2')));
  for (const field of ['step_time', 'in_time', 'dwell_time', 'decay_time']) await timeline.locator('input').nth(section.editable.indexOf(field)).fill('0');
  expect(await timeline.locator('svg').innerHTML()).not.toMatch(/NaN|Infinity/);
  await timeline.locator('input').nth(section.editable.indexOf('on_state')).fill('150');
  await expect(timeline.locator('input').nth(section.editable.indexOf('on_state'))).toHaveValue('100');
  await timeline.getByRole('button', { name: '初期値に戻す' }).click();
  await timeline.locator('input').nth(section.editable.indexOf('step_time')).fill('0.2');
  await page.reload();
  await expect(timeline.locator('input').nth(section.editable.indexOf('step_time'))).toHaveValue('0.5');
  await noOverflow(page);
  const scroller = timeline.getByRole('region');
  await scroller.focus(); await page.keyboard.press('ArrowRight');
  await expect.poll(() => scroller.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await timeline.screenshot({ path: 'test-results/timeline-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 1100 }); await noOverflow(page);
  await timeline.screenshot({ path: 'test-results/timeline-desktop.png' });
});










test('Magic Sheet images remain unannotated and structured content renders', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#/guide/14_1');
  await expect(page.locator('[data-section-type="image"] img')).toHaveCount(2);
  await expect(page.locator('.image-annotation')).toHaveCount(0);
  await expect(page.locator('[data-section-type="image"]').nth(0)).toContainText('Liveモード');
  await expect(page.locator('[data-section-type="image"]').nth(1)).toContainText('Blindモード');
  await expect(page.locator('img').nth(0)).toHaveAttribute('src', '/assets/magic-sheet/magic-sheet-live.png');
  await page.goto('/#/guide/14_2');
  await expect(page.locator('[data-section-type="image"] img')).toHaveCount(1);
  await expect(page.locator('.content-table-scroll')).toHaveCount(2);
  await expect(page.locator('.image-annotation')).toHaveCount(0);
  await expect(page.locator('.step-timeline')).toHaveCount(0);
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).resolves.toBeTruthy();
});




