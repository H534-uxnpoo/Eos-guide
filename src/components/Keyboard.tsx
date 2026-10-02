import { useState } from 'react';
import { articleById, data, keyboardEntries, pcBindings } from '../data';
import CommandKeys from './CommandKeys';

const groups = [
  { title: 'チャンネル操作', categories: ['channels'] },
  { title: '記録・再生', categories: ['playback'] },
  { title: '画面・設定', categories: ['screens', 'settings'] },
  { title: 'Effect・便利機能', categories: ['effects', 'utilities'] },
];

export default function Keyboard() {
  const [selected, setSelected] = useState(keyboardEntries[0]?.key ?? '');
  const entry = keyboardEntries.find(item => item.key === selected);
  const article = entry ? articleById.get(entry.article_id) : undefined;
  const bindingFor = (key: string) => pcBindings.find(binding => binding.eos_key.toLowerCase() === key.toLowerCase());

  return <>
    <span className="eyebrow">KEY REFERENCE</span>
    <h1>Eosキーボード</h1>
    <p className="page-description">キーをタップして、役割と使い方を確認。</p>

    <section className="keyboard-layout-section" aria-labelledby="keyboard-layout-title">
      <h2 id="keyboard-layout-title">キーボード配置画像</h2>
      <div className="keyboard-layout-scroll" tabIndex={0} aria-label="横スクロールできるキーボード配置画像">
        <img src="/assets/keyboard/eos-keyboard.png" alt="Eosキーボード全体とPCキーボードの対応" className="keyboard-layout-image" loading="lazy" />
      </div>
      <p className="keyboard-layout-caption">各キーの右下に表示されている小さな文字は、PCキーボードで使用するキーです。画面上ではa4などの省略表記ではなく、Alt＋4、Ctrl＋Qのように展開して表示します。</p>
    </section>

    <section className="pc-shortcuts">
      <h2>{data.pc_keyboard!.display.table_title}</h2>
      <div className="content-table-scroll"><table><thead><tr><th>Eosキー</th><th>表示コード</th><th>PC操作</th><th>内容</th></tr></thead><tbody>{pcBindings.map(binding => <tr key={binding.display}><th scope="row">{binding.eos_key}</th><td><code>{binding.display}</code></td><td>{binding.keys.join(' + ')}</td><td>{binding.purpose}</td></tr>)}</tbody></table></div>
    </section>

    <section className="keyboard-key-finder" aria-label="Eosキーの機能を確認">
      <h2>キーの機能を確認</h2>
      <div className="keyboard-layout">
        <div>{groups.map(group => <section className="key-group" key={group.title}><h3>{group.title}</h3><div className="key-grid">{keyboardEntries.filter(item => group.categories.includes(articleById.get(item.article_id)?.category_id ?? '')).map(item => { const binding = bindingFor(item.key); const expanded = binding ? binding.keys.join(' + ') : ''; return <button key={item.key} aria-pressed={selected === item.key} aria-label={`${item.key}${expanded ? `（${expanded}）` : ''}`} onClick={() => setSelected(item.key)}>{item.key}{binding && <small className="pc-code">{binding.display}</small>}</button>; })}</div></section>)}</div>
        <section id="key-description" className="detail-card key-description" aria-live="polite"><span className="eyebrow">SELECTED KEY</span><h2>{selected}</h2>{article && <><p>{article.summary}</p>{article.commands.map((command, i) => <CommandKeys key={i} command={command} />)}<a className="primary-link" href={`#${article.route}`}>「{article.title}」の記事を見る →</a></>}</section>
      </div>
    </section>
  </>;
}
