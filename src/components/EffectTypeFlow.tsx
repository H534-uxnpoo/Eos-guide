/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
export default function EffectTypeFlow({section}:{section:any}){const choices=Array.isArray(section.choices)?section.choices:[];const [id,setId]=useState(choices[0]?.id);const c=choices.find((x:any)=>x.id===id)||choices[0];return <section className="detail-card visual-widget effect-flow"><h2>{section.title}</h2><div className="effect-flow-grid"><div className="effect-flow-area"><span className="visual-detail-label">目的を選ぶ</span><p className="visual-description">{section.prompt}</p><div className="effect-choices">{choices.map((x:any)=><button key={x.id} aria-pressed={x.id===id} onClick={()=>setId(x.id)}>{x.label}</button>)}</div></div>{c&&<><div aria-live="polite" className="effect-result-area"><span className="visual-detail-label">おすすめタイプ</span><strong>{c.result}</strong>{c.article_id&&<a href={`#/guide/${c.article_id}`}>関連記事を見る →</a>}</div><div className="effect-description-area"><span className="visual-detail-label">説明</span><p>{c.description}</p></div></>}</div></section>}


