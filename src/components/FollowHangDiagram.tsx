"use client";
/* eslint-disable react-hooks/static-components */
import { useId, useMemo, useState } from 'react';

export type FollowHangDiagramProps = {
  title?: string;
  cue_time?: number;
  follow_time?: number;
  hang_time?: number;
};

const numberOr = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(99.9, Math.max(0, parsed)) : fallback;
};

const showSeconds = (value: number) => `${Number(value.toFixed(2))}s`;

export function FollowHangDiagram({
  title = 'Follow／Hang 比較図',
  cue_time = 3,
  follow_time = 5,
  hang_time = 2,
}: FollowHangDiagramProps) {
  const id = useId();
  const [cueTime, setCueTime] = useState(numberOr(cue_time, 3));
  const [followTime, setFollowTime] = useState(numberOr(follow_time, 5));
  const [hangTime, setHangTime] = useState(numberOr(hang_time, 2));

  const followNext = followTime;
  const hangNext = cueTime + hangTime;
  const total = Math.max(1, Math.ceil(Math.max(cueTime, followNext, hangNext)) + 1);
  const startX = 150;
  const plotWidth = 570;
  const unit = plotWidth / total;
  const tickStep = Math.max(1, Math.ceil(total / 8));
  const ticks = useMemo(() => {
    const values: number[] = [];
    for (let value = 0; value <= total; value += tickStep) values.push(value);
    if (values.at(-1) !== total) values.push(total);
    return values;
  }, [total, tickStep]);

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box' as const,
    marginTop: 5,
    padding: '8px 10px',
    border: '1px solid #475569',
    borderRadius: 7,
    background: '#111827',
    color: '#f8fafc',
    fontSize: 16,
  };

  const Timeline = ({ mode }: { mode: 'follow' | 'hang' }) => {
    const isFollow = mode === 'follow';
    const nextAt = isFollow ? followNext : hangNext;
    const measureStart = isFollow ? 0 : cueTime;
    const measureTime = isFollow ? followTime : hangTime;
    const y = isFollow ? 88 : 226;
    const measureY = y + 55;
    return (
      <g>
        <text x="20" y={y + 4} fill="#f4c44e" fontSize="15" fontWeight="700">
          {isFollow ? `Follow ${showSeconds(followTime)}` : `Hang ${showSeconds(hangTime)}`}
        </text>
        <text x="20" y={y + 24} fill="#cbd5e1" fontSize="12">
          {isFollow ? 'Q1のGOから数える' : 'Q1の完了後から数える'}
        </text>
        <rect x={startX} y={y - 15} width={Math.max(3, cueTime * unit)} height="30" rx="5" fill="#5eb4e6" />
        <text x={startX + Math.max(20, cueTime * unit / 2)} y={y + 5} textAnchor="middle" fill="#071018" fontSize="12" fontWeight="700">
          Q1 Time {showSeconds(cueTime)}
        </text>
        <text x={startX} y={y - 27} textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">Q1 GO</text>
        <text x={startX + cueTime * unit} y={y - 27} textAnchor="middle" fill="#cbd5e1" fontSize="12">Q1完了</text>
        <line x1={startX + measureStart * unit} y1={measureY} x2={startX + nextAt * unit} y2={measureY} stroke="#f4c44e" strokeWidth="3" />
        <line x1={startX + measureStart * unit} y1={measureY - 7} x2={startX + measureStart * unit} y2={measureY + 7} stroke="#f4c44e" strokeWidth="2" />
        <line x1={startX + nextAt * unit} y1={measureY - 7} x2={startX + nextAt * unit} y2={measureY + 7} stroke="#f4c44e" strokeWidth="2" />
        <text x={startX + (measureStart + measureTime / 2) * unit} y={measureY + 20} textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">
          {isFollow ? 'GO ＋ Follow' : '完了 ＋ Hang'}
        </text>
        <line x1={startX + nextAt * unit} y1={y - 40} x2={startX + nextAt * unit} y2={measureY} stroke="#f4c44e" strokeWidth="2" />
        <circle cx={startX + nextAt * unit} cy={y} r="7" fill="#f4c44e" />
        <text x={startX + nextAt * unit} y={y - 48} textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">Q2 GO</text>
      </g>
    );
  };

  return (
    <figure style={{ margin: '20px 0', padding: 16, border: '1px solid #334155', borderRadius: 14, background: '#0b1118', color: '#f8fafc' }}>
      <figcaption style={{ marginBottom: 10, color: '#f4c44e', fontWeight: 700 }}>{title}</figcaption>
      <p style={{ margin: '0 0 14px', color: '#cbd5e1', fontSize: 14 }}>
        Cue Time・Follow・Hangを変更すると、Q2の開始位置がリアルタイムで動きます。</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 10, marginBottom: 14 }}>
        <label htmlFor={`${id}-cue`} style={{ color: '#cbd5e1', fontSize: 13 }}>
          Cue Time          <input id={`${id}-cue`} type="number" inputMode="decimal" min="0" max="99.9" step="0.1" value={cueTime} onChange={(event) => setCueTime(numberOr(event.target.value, 0))} style={inputStyle} />
        </label>
        <label htmlFor={`${id}-follow`} style={{ color: '#cbd5e1', fontSize: 13 }}>
          Follow          <input id={`${id}-follow`} type="number" inputMode="decimal" min="0" max="99.9" step="0.1" value={followTime} onChange={(event) => setFollowTime(numberOr(event.target.value, 0))} style={inputStyle} />
        </label>
        <label htmlFor={`${id}-hang`} style={{ color: '#cbd5e1', fontSize: 13 }}>
          Hang          <input id={`${id}-hang`} type="number" inputMode="decimal" min="0" max="99.9" step="0.1" value={hangTime} onChange={(event) => setHangTime(numberOr(event.target.value, 0))} style={inputStyle} />
        </label>
      </div>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <svg
          viewBox="0 0 760 360"
          role="img"
          aria-label={`Cue Time ${showSeconds(cueTime)}。FollowはQ1のGOから${showSeconds(followTime)}後、HangはQ1の完了後から${showSeconds(hangTime)}後にQ2を開始`}
          style={{ display: 'block', width: '100%', minWidth: 680, height: 'auto', fontFamily: "'Yu Gothic', 'YuGothic', 'Meiryo', 'Noto Sans JP', system-ui, sans-serif" }}
        >
          <rect x="0" y="0" width="760" height="360" fill="#0b1118" />
          {ticks.map((second) => {
            const x = startX + second * unit;
            return (
              <g key={second}>
                <line x1={x} y1="34" x2={x} y2="338" stroke="#334155" strokeWidth="1" />
                <text x={x} y="22" textAnchor="middle" fill="#cbd5e1" fontSize="12">{showSeconds(second)}</text>
              </g>
            );
          })}
          <Timeline mode="follow" />
          <Timeline mode="hang" />
        </svg>
      </div>
      <p aria-live="polite" style={{ margin: '8px 0 0', color: '#cbd5e1', fontSize: 13 }}>
        FollowのQ2開始: {showSeconds(followNext)} / HangのQ2開始: {showSeconds(hangNext)}
      </p>
    </figure>
  );
}





