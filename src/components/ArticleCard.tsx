import type { Article } from '../types';
import { pageLabel } from '../data';
import Icon from './Icon';
export function FavoriteButton({ article, saved, toggle }: { article: Article; saved: boolean; toggle: (id: string) => void }) {
  return <button className={`favorite-button ${saved ? 'is-saved' : ''}`} aria-label={`${article.title}をお気に入り${saved ? 'から解除' : 'に登録'}`} aria-pressed={saved} onClick={() => toggle(article.id)}><Icon name="bookmark" /></button>;
}
export default function ArticleCard({ article, saved, toggle }: { article: Article; saved: boolean; toggle: (id: string) => void }) {
  return <article className="article-card"><div className="article-card-heading"><a href={`#${article.route}`}><span className="eyebrow">{article.manual_section} / {article.chapter_title}</span><h2>{article.title}</h2></a><FavoriteButton article={article} saved={saved} toggle={toggle} /></div><p>{article.summary}</p><div className="tags">{(article.when_to_use.length ? article.when_to_use : article.keywords).slice(0, 3).map((tag, i) => <span key={i}>{tag}</span>)}</div><a className="card-bottom" href={`#${article.route}`}><span>マニュアル {pageLabel(article.source)}</span><span>操作を見る <Icon name="arrow" size={16} /></span></a></article>;
}
