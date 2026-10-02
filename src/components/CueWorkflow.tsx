/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
export default function CueWorkflow({section}:{section:any}){const steps=Array.isArray(section.steps)?section.steps:[];const [selected,setSelected]=useState(steps[0]?.id);const current=steps.find((s:any)=>s.id===selected)||steps[0];return <section className="detail-card interactive-workflow"><h2>{section.title}</h2><div className="workflow-grid">{steps.map((s:any)=><button className="visual-choice" key={s.id} aria-pressed={s.id===selected} onClick={()=>setSelected(s.id)}><span className="visual-number">工程 {s.number}</span><strong className="visual-title">{s.title}</strong><span className="visual-description">{s.short}</span></button>)}</div>{current&&<div aria-live="polite" className="workflow-detail visual-detail"><span className="visual-detail-label">選択中の工程 {current.number}</span><p>{current.detail}</p>{current.command&&<code>{current.command}</code>}{current.article_id&&<a href={`#/guide/${current.article_id}`}>関連記事を見る →</a>}</div>}</section>}


