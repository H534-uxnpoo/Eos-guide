/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
export default function SubmasterVisualizer({section}:{section:any}){const inputs=Array.isArray(section.inputs)?section.inputs:[];const [vals,setVals]=useState(Object.fromEntries(inputs.map((i:any)=>[i.id,i.default])));const [last,setLast]=useState(inputs[0]?.id||'A');const htp=Math.max(...Object.values(vals).map(Number),0);return <section className="detail-card visual-widget"><h2>{section.title}</h2><div className="submaster-inputs">{inputs.map((i:any)=><label key={i.id}><span>{i.label}</span><strong>{vals[i.id]}%</strong><input type="range" min="0" max="100" value={vals[i.id]} onChange={e=>{setVals({...vals,[i.id]:Number(e.target.value)});setLast(i.id)}}/></label>)}</div><div aria-live="polite" className="submaster-results"><span className="visual-detail-label">計算結果</span><div><article><span>HTP</span><strong>{htp}%</strong><small>高い方の値</small></article><article><span>LTP</span><strong>{vals[last]}%</strong><small>最後に動かした入力：{last}</small></article></div></div><div className="submaster-modes"><span className="visual-detail-label">Submasterの3モード</span><ul>{(section.modes||[]).map((m:any)=><li key={m.id}><b>{m.label}</b><span>{m.description}</span></li>)}</ul></div></section>}



