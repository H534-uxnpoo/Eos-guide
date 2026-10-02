"use client";
import { useId, useMemo, useState } from 'react';

type CueTimes = {
  intensity_up: number;
  intensity_down: number;
  focus: number;
  color: number;
  beam: number;
};

export type CueTimingDiagramProps = {
  title?: string;
  delay?: number;
  times?: Partial<CueTimes>;
};

const defaults: CueTimes = {
  intensity_up: 3,
  intensity_down: 5,
  focus: 4,
  color: 2,
  beam: 3,
};

const rows: Array<{ key: keyof CueTimes; label: string; color: string }> = [
  { key: 'intensity_up', label: 'Intensity Up', color: '#f4c44e' },
  { key: 'intensity_down', label: 'Intensity Down', color: '#ef8f61' },
  { key: 'focus', label: 'Focus', color: '#5eb4e6' },
  { key: 'color', label: 'Color', color: '#b77ee6' },
  { key: 'beam', label: 'Beam', color: '#50c59e' },
];

const numberOr = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(99.9, Math.max(0, parsed)) : fallback;
};

const showSeconds = (value: number) => `${Number(value.toFixed(2))}s`;

export function CueTimingDiagram({
  title = 'Time／Delay 数直線',
  delay = 1,
  times,
}: CueTimingDiagramProps) {
  const id = useId();
  const initialDelay = numberOr(delay, 1);
  const initialTimes: CueTimes = {
    intensity_up: numberOr(times?.intensity_up, defaults.intensity_up),
    intensity_down: numberOr(times?.intensity_down, defaults.intensity_down),
    focus: numberOr(times?.focus, defaults.focus),
    color: numberOr(times?.color, defaults.color),
    beam: numberOr(times?.beam, defaults.beam),
  };
  const [editableDelay, setEditableDelay] = useState(initialDelay);
  const [editableTimes, setEditableTimes] = useState<CueTimes>(initialTimes);

  const longest = Math.max(...Object.values(editableTimes));
  const total = Math.max(1, Math.ceil(editableDelay + longest));
  const startX = 158;
  const plotWidth = 570;
  const unit = plotWidth / total;
  const tickStep = Math.max(1, Math.ceil(total / 8));
  const ticks = useMemo(() => {
    const values: number[] = [];
    for (let value = 0; value <= total; value += tickStep) values.push(value);
    if (values.at(-1) !== total) values.push(total);
    return values;
  }, [total, tickStep]);

  const changeTime = (key: keyof CueTimes, raw: string) => {
    setEditableTimes((current) => ({ ...current, [key]: numberOr(raw, 0) }));
  };

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

  return (
    <figure style={{ margin: '20px 0', padding: 16, border: '1px solid #334155', borderRadius: 14, background: '#0b1118', color: '#f8fafc' }}>
      <figcaption style={{ marginBottom: 10, color: '#f4c44e', fontWeight: 700 }}>{title}</figcaption>
      <p style={{ margin: '0 0 14px', color: '#cbd5e1', fontSize: 14 }}>
        謨ｰ蛟､繧貞､画峩縺吶ｋ縺ｨ縲∽ｸ九・謨ｰ逶ｴ邱壹∈繝ｪ繧｢繝ｫ繧ｿ繧､繝縺ｧ蜿肴丐縺輔ｌ縺ｾ縺吶・      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 10, marginBottom: 14 }}>
        <label htmlFor={`${id}-delay`} style={{ color: '#cbd5e1', fontSize: 13 }}>
          Delay・育ｧ抵ｼ・          <input id={`${id}-delay`} type="number" inputMode="decimal" min="0" max="99.9" step="0.1" value={editableDelay} onChange={(event) => setEditableDelay(numberOr(event.target.value, 0))} style={inputStyle} />
        </label>
        {rows.map((row) => (
          <label key={row.key} htmlFor={`${id}-${row.key}`} style={{ color: '#cbd5e1', fontSize: 13 }}>
            {row.label}・育ｧ抵ｼ・            <input id={`${id}-${row.key}`} type="number" inputMode="decimal" min="0" max="99.9" step="0.1" value={editableTimes[row.key]} onChange={(event) => changeTime(row.key, event.target.value)} style={inputStyle} />
          </label>
        ))}
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <svg
          viewBox="0 0 760 350"
          role="img"
          aria-label={`GO蠕後↓${showSeconds(editableDelay)}蠕・■縲！ntensity Up ${showSeconds(editableTimes.intensity_up)}縲！ntensity Down ${showSeconds(editableTimes.intensity_down)}縲：ocus ${showSeconds(editableTimes.focus)}縲，olor ${showSeconds(editableTimes.color)}縲。eam ${showSeconds(editableTimes.beam)}縺ｧ螟牙喧縺吶ｋ謨ｰ逶ｴ邱啻`}
          style={{ display: 'block', width: '100%', minWidth: 680, height: 'auto' }}
        >
          <rect x="0" y="0" width="760" height="350" fill="#0b1118" />
          {ticks.map((second) => {
            const x = startX + second * unit;
            return (
              <g key={second}>
                <line x1={x} y1="38" x2={x} y2="326" stroke="#334155" strokeWidth="1" />
                <text x={x} y="25" textAnchor="middle" fill="#cbd5e1" fontSize="12">{showSeconds(second)}</text>
              </g>
            );
          })}
          <line x1={startX} y1="38" x2={startX + plotWidth} y2="38" stroke="#64748b" strokeWidth="2" />
          <text x={startX} y="58" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">GO</text>

          {rows.map((row, index) => {
            const y = 76 + index * 50;
            const duration = editableTimes[row.key];
            const delayWidth = editableDelay * unit;
            const timeWidth = duration * unit;
            return (
              <g key={row.key}>
                <text x="145" y={y + 19} textAnchor="end" fill="#f8fafc" fontSize="13">{row.label}</text>
                {editableDelay > 0 && <rect x={startX} y={y} width={Math.max(2, delayWidth)} height="28" rx="5" fill="#64748b" />}
                <rect x={startX + delayWidth} y={y} width={Math.max(3, timeWidth)} height="28" rx="5" fill={row.color} />
                {editableDelay > 0 && delayWidth >= 58 && (
                  <text x={startX + delayWidth / 2} y={y + 19} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">Delay {showSeconds(editableDelay)}</text>
                )}
                <text
                  x={Math.min(startX + plotWidth - 4, startX + delayWidth + Math.max(16, timeWidth / 2))}
                  y={y + 19}
                  textAnchor={timeWidth < 55 ? 'start' : 'middle'}
                  fill={timeWidth < 55 ? '#f8fafc' : '#071018'}
                  fontSize="12"
                  fontWeight="700"
                >
                  Time {showSeconds(duration)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p aria-live="polite" style={{ margin: '8px 0 0', color: '#cbd5e1', fontSize: 13 }}>
        轣ｰ濶ｲ縺轡elay縲∬牡莉倥″驛ｨ蛻・′螳滄圀縺ｫ螟牙喧縺励※縺・ｋTime縺ｧ縺吶・      </p>
    </figure>
  );
}




