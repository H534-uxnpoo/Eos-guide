import type { Article } from '../types';
import { pageLabel } from '../data';
import { FavoriteButton } from './ArticleCard';
import CommandKeys from './CommandKeys';
import ShortcutKeys from './ShortcutKeys';
import ContentSections from './ContentSections';
export default function ArticleDetail({ article, saved, toggle }: { article: Article; saved: boolean; toggle: (id: string) => void }) {
  const whenToUse = Array.isArray(article.when_to_use) ? article.when_to_use : [];
  const commands = Array.isArray(article.commands) ? article.commands : [];
  const warnings = Array.isArray(article.warnings) ? article.warnings : [];
  const subtopics = Array.isArray(article.subtopics) ? article.subtopics : [];
  const steps = Array.isArray(article.steps) ? article.steps : [];
  const diagrams = Array.isArray(article.diagrams) ? article.diagrams : [];
  return <><div className="detail-title"><div><span className="eyebrow">GUIDE {article.manual_section} / {article.chapter_title}</span><h1>{article.title}</h1></div><FavoriteButton article={article} saved={saved} toggle={toggle} /></div><div className="detail-sections">
    {article.summary && <section className="detail-card lead-card"><h2>ひとことで</h2><p>{article.summary}</p></section>}
    {whenToUse.length > 0 && <section className="detail-card"><h2>こんなときに使う</h2><ul>{whenToUse.map((item, i) => <li key={i}>{item}</li>)}</ul></section>}
    {steps.length > 0 && <section className="detail-card"><h2>操作手順</h2><ol>{steps.map((step, i) => <li key={i}>{step}</li>)}</ol></section>}
    {Array.isArray(article.content_sections) && <ContentSections sections={article.content_sections} />}
    {commands.length > 0 && <section className="detail-card"><h2>コマンド例</h2>{commands.map((command, i) => <CommandKeys command={command} key={i} />)}</section>}
    {Array.isArray(article.keyboard_shortcuts) && article.keyboard_shortcuts.length > 0 && <section className="detail-card"><h2>PCキーボード</h2>{article.keyboard_shortcuts.filter((shortcut) => Array.isArray(shortcut.keycaps) && Array.isArray(shortcut.followed_by)).map((shortcut, i) => <ShortcutKeys shortcut={shortcut} key={shortcut.id ?? i} />)}</section>}
    {warnings.length > 0 && <section className="detail-card warning"><h2>注意点</h2><ul>{warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul></section>}
    {subtopics.length > 0 && <section className="detail-card"><h2>関連する小項目</h2><ul className="subtopics">{subtopics.map((topic, i) => <li key={`${topic.id}-${i}`}><span>{topic.id}</span>{topic.title}</li>)}</ul></section>}
    {diagrams.map((diagram, i) => <figure className="diagram" key={i}>{diagram.src ? <img src={diagram.src} alt={diagram.alt} /> : <div><p>画面図は準備中</p><small>{diagram.alt}</small></div>}{diagram.caption && <figcaption>{diagram.caption}</figcaption>}</figure>)}
    <section className="detail-card source"><h2>マニュアル参照ページ</h2><strong>{pageLabel(article.source)}</strong><p>{article.source.manual}</p></section>
  </div></>;
}

