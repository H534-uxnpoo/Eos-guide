/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
export default function Glossary({section}:{section:any}){const terms=Array.isArray(section.terms)?section.terms:[];const [selected,setSelected]=useState(terms[0]?.term);const item=terms.find((t:any)=>t.term===selected)||terms[0];return <section className="detail-card visual-widget"><h2>{section.title}</h2><div className="glossary-grid">{terms.map((t:any)=><button className="visual-choice" key={t.term} aria-pressed={t.term===selected} onClick={()=>setSelected(t.term)}><strong className="visual-title">{t.term}</strong></button>)}</div>{item&&<div aria-live="polite" className="glossary-definition visual-detail"><span className="visual-detail-label">用語の説明</span><p>{item.definition}</p></div>}</section>}

