/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { articleById, categoryColor, data, keyboardEntries, resolveArticleId } from './data';
import Icon from './components/Icon';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import Keyboard from './components/Keyboard';

const STORAGE_KEY = 'eos-guide:favorites';
function loadFavorites(): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string').map(resolveArticleId).filter(id => articleById.has(id)))] : []; } catch { return []; }
}
function readRoute() {
  try {
    const route = decodeURIComponent(location.hash.slice(1) || location.pathname);
    const match = /^\/guide\/([^/]+)$/.exec(route);
    if (match) {
      const target = resolveArticleId(match[1]);
      if (match[1] === '1_4') {
        history.replaceState(null, '', '/#/keyboard');
        return '/keyboard';
      }
      if (target !== match[1] && articleById.has(target)) {
        const canonical = articleById.get(target)!.route;
        history.replaceState(null, '', '/#' + canonical);
        return canonical;
      }
    }
    return route;
  } catch { return '/not-found'; }
}
export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [storageError, setStorageError] = useState('');
  const [query, setQuery] = useState('');
  const [online, setOnline] = useState(navigator.onLine);
  const main = useRef<HTMLElement>(null);
  const { offlineReady: [offlineReady], needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();
  useEffect(() => {
    const navigate = () => { setRoute(readRoute()); window.scrollTo(0, 0); requestAnimationFrame(() => main.current?.focus()); };
    const connection = () => setOnline(navigator.onLine);
    const sync = () => setFavorites(loadFavorites());
    window.addEventListener('hashchange', navigate); window.addEventListener('popstate', navigate);
    window.addEventListener('online', connection); window.addEventListener('offline', connection); window.addEventListener('storage', sync);
    return () => { window.removeEventListener('hashchange', navigate); window.removeEventListener('popstate', navigate); window.removeEventListener('online', connection); window.removeEventListener('offline', connection); window.removeEventListener('storage', sync); };
  }, []);
  useEffect(() => {
    const match = /^\/guide\/([^/]+)$/.exec(route);
    if (!match) return;
    const target = resolveArticleId(match[1]);
    const targetArticle = articleById.get(target);
    if (targetArticle && target !== match[1] && targetArticle.route !== route) {
      history.replaceState(null, '', `/#${targetArticle.route}`);
      setRoute(targetArticle.route);
    }
  }, [route]);
  useEffect(() => {
    try {
      const serialized = JSON.stringify(favorites);
      if (localStorage.getItem(STORAGE_KEY) !== serialized) localStorage.setItem(STORAGE_KEY, serialized);
    } catch { /* 保存不可でも移行済み一覧は使用可能。登録操作時に保存エラーを案内する。 */ }
  }, [favorites]);
  const toggle = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id];
    setFavorites(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(''); } catch { setStorageError('お気に入りを保存できません。このブラウザの保存設定を確認してください。'); }
  };
  const category = route.startsWith('/category/') ? data.ui_model.home_buttons.find(item => item.id === route.split('/')[2]) : undefined;
  const article = route.startsWith('/guide/') ? data.articles.find(item => item.route === route) : undefined;
  const isHome = route === '/' || route === '/index.html';
  const isKeyboard = route === '/keyboard' || category?.id === 'keyboard';
  const title = article?.title ?? category?.label ?? (route === '/favorites' ? 'お気に入り' : route === '/search' ? '記事を検索' : isKeyboard ? 'Eosキーボード' : isHome ? '' : 'ページが見つかりません');
  useEffect(() => { document.title = title ? `${title} | EOS GUIDE` : 'EOS GUIDE — Eos操作ガイド'; }, [title]);
  const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const terms = normalize(query).split(' ').filter(Boolean);
  const articles = category ? data.articles.filter(item => item.category_id === category.id) : route === '/favorites' ? data.articles.filter(item => favorites.includes(item.id)) : route === '/search' && terms.length ? data.articles.filter(item => { const haystack = normalize([item.title, item.summary, ...item.keywords, ...item.when_to_use, ...item.commands, ...item.subtopics.map(topic => topic.title)].join(' ')); return terms.every(term => haystack.includes(term)); }) : [];
  const accent = categoryColor(article?.category_id ?? category?.id ?? '');
  return <div className="app" style={{ '--accent': accent } as CSSProperties}>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>本文へ移動</a>
    <header className="site-header"><a className="brand" href="#/" aria-label="EOS GUIDE ホーム"><span className="brand-mark">E<span>▰</span></span><span>EOS <b>GUIDE</b><small>FIELD REFERENCE</small></span></a><a className="header-favorite" href="#/favorites"><Icon name="bookmark" size={19}/><span>お気に入り</span><span className="count">{favorites.length}</span></a></header>
    <main id="main-content" ref={main} tabIndex={-1}>
      {!isHome && <nav className="breadcrumb" aria-label="パンくず"><a href="#/"><Icon name="back" size={16}/>ホーム</a>{article && <><span>/</span><a href={`#/category/${article.category_id}`}>{data.ui_model.home_buttons.find(item => item.id === article.category_id)?.label}</a></>}</nav>}
      {storageError && <p role="alert" className="notice warning">{storageError}</p>}
      {needRefresh && <div className="notice">新しいガイドを利用できます。<button onClick={() => void updateServiceWorker(true)}>更新する</button></div>}
      {isHome ? <>
        <section className="hero"><div className="eyebrow"><span className="live-dot"/><h1>EOS操作ガイド<br className="mobile-break"/></h1><span/></div></section>
        <div className="section-heading"><h2>目的から探す</h2><span>12 CATEGORIES</span></div>
        <div className="category-grid">{data.ui_model.home_buttons.map((button, index) => <a className="category-tile" key={button.id} href={button.id === 'keyboard' ? '#/keyboard' : `#/category/${button.id}`} style={{ '--tile-accent': categoryColor(button.id) } as CSSProperties}><div className="tile-top"><span className="tile-icon"><Icon name={button.icon} size={27}/></span><span className="tile-number">{String(index + 1).padStart(2, '0')}</span></div><h3>{button.label}</h3><p>{button.description}</p><div className="tile-bottom"><span>{button.id === 'keyboard' ? `${keyboardEntries.length} KEYS` : `${data.articles.filter(article => article.category_id === button.id).length} ARTICLES`}</span><Icon name="arrow" size={17}/></div></a>)}</div>
        <a className="search-entry" href="#/search"><Icon name="search" size={20}/><span>キーワードで記事を探す</span><span className="search-hint">キー名・操作名など</span><Icon name="arrow" size={16}/></a>
      </> : isKeyboard ? <Keyboard/> : article ? <ArticleDetail article={article} saved={favorites.includes(article.id)} toggle={toggle}/> : category || route === '/favorites' || route === '/search' ? <>
        <span className="eyebrow">{category ? 'CATEGORY GUIDE' : route === '/favorites' ? 'YOUR BOOKMARKS' : 'QUICK SEARCH'}</span><h1>{title}</h1>
        {category && <p className="page-description">{category.description}</p>}
        {route === '/search' && <form role="search" onSubmit={event => event.preventDefault()}><label htmlFor="article-search">キー名・操作名・キーワード</label><div className="search-field"><Icon name="search"/><input autoFocus id="article-search" type="search" placeholder="例：保存、Sneak、Cue" value={query} onChange={event => setQuery(event.target.value)}/></div></form>}
        <p className="result-count" aria-live="polite">{articles.length} 記事{route === '/search' && !terms.length ? ' · キーワードを入力してください' : ''}</p>
        <div className="article-grid">{articles.map(item => <ArticleCard key={item.id} article={item} saved={favorites.includes(item.id)} toggle={toggle}/>)}</div>
        {!articles.length && (route !== '/search' || terms.length > 0) && <div className="empty-state"><Icon name={route === '/favorites' ? 'bookmark' : 'search'} size={32}/><h2>{route === '/favorites' ? 'お気に入りはまだありません' : '該当する記事がありません'}</h2><p>{route === '/favorites' ? '記事のしおりボタンを押すと、ここからすぐに開けます。' : '別のキー名や短いキーワードでお試しください。'}</p><a className="primary-link" href="#/">目的から探す →</a></div>}
      </> : <div className="empty-state"><span className="eyebrow">404 / NOT FOUND</span><h1>ページが見つかりません</h1><p>記事が存在しないか、URLが変更されています。</p><a className="primary-link" href="#/">ホームへ戻る →</a></div>}
    </main>
    <footer><span>EOS GUIDE <span className="footer-divider">/</span> ETC Eos Family</span><span className="offline-status"><i className={offlineReady || !online ? 'ready' : ''}/>{!online ? 'オフライン' : offlineReady ? 'オフライン利用可能' : 'Eos v3.2.7 対応確認'}</span></footer>
    <nav className="bottom-nav" aria-label="メインナビゲーション"><a href="#/" aria-current={isHome ? 'page' : undefined}><Icon name="home" size={20}/>ホーム</a><a href="#/keyboard" aria-current={isKeyboard ? 'page' : undefined}><Icon name="keyboard" size={20}/>キーボード</a><a href="#/search" aria-current={route === '/search' ? 'page' : undefined}><Icon name="search" size={20}/>検索</a><a href="#/favorites" aria-current={route === '/favorites' ? 'page' : undefined}><Icon name="bookmark" size={20}/>お気に入り</a></nav>
  </div>;
}






