import type { GuideData } from './types';
import raw from '../EOS_GUIDE_v015_Interactive_Visual_Update/eos-guide-data-v0.15.json';
export const data = raw as GuideData;
export const articleById = new Map(data.articles.map(article => [article.id, article]));
const mergedIds = new Map<string, string>(data.editorial_review.merge_groups.flatMap(group => group.source_ids.filter(id => id !== group.target_id).map(id => [id, group.target_id] as const)));
Object.entries(data.editorial_review.redirects ?? {}).forEach(([from, to]) => mergedIds.set(from, to));
Object.entries(data.editorial_review.favorite_id_migrations ?? {}).forEach(([from, to]) => mergedIds.set(from, to));
export const resolveArticleId = (id: string) => mergedIds.get(id) ?? id;
export const keyboardEntries = data.keyboard_index.filter(entry => articleById.has(resolveArticleId(entry.article_id))).map(entry => ({ ...entry, article_id: resolveArticleId(entry.article_id) }));
export const decodePcCode = (): string[] => [];
export const pcBindings = (data.pc_keyboard?.bindings ?? []).filter(binding => binding.display).map(binding => ({ ...binding, keys: binding.keys }));
export const categoryColor = (id: string) => data.ui_model.home_buttons.find(item => item.id === id)?.theme_color ?? data.chapters.find(chapter => chapter.category_id === id)?.theme_color ?? '#a6b5c8';
export const pageLabel = (source: { page_start: number; page_end: number }) => source.page_start === source.page_end ? `p. ${source.page_start}` : `pp. ${source.page_start}–${source.page_end}`;










