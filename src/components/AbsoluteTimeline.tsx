import { useId, useState } from 'react';
import type { AbsoluteEffectPreviewSection } from '../types';
import EffectPlaybackControls from './effects/EffectPlaybackControls';
import FixturePreview from './effects/FixturePreview';
import { clampPercent, mixHex } from './effects/effectColors';
import { useEffectPlayback } from './effects/useEffectPlayback';

const BACKGROUND = '#17212a';
const DEFAULT_YELLOW = '#ffd21f';
const format = (value: number) => Number((Number.isFinite(value) ? value : 0).toFixed(2)).toString();

function partitionChannels(channels: number[], grouping: number) {
  const count = Math.max(1, Math.min(channels.length || 1, Math.round(grouping)));
  const baseSize = Math.floor(channels.length / count);
  const remainder = channels.length % count;
  let cursor = 0;
  return Array.from({ length: count }, (_, index) => {
    const size = baseSize + (index < remainder ? 1 : 0);
    const group = channels.slice(cursor, cursor + size);
    cursor += size;
    return group;
  });
}

function colorFromLevel(value: string) {
  const text = value.trim();
  const hex = /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(text);
  const rgb = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(text);
  const names = ['red', 'blue', 'green', 'white', 'cyan', 'magenta', 'orange', 'yellow', 'purple', 'lime'];
  const named = names.includes(text.toLowerCase());
  return hex || rgb || named ? text : DEFAULT_YELLOW;
}

function resolveLevel(value: string) {
  const text = value.trim();
  if (/^bkgrd$/i.test(text)) return { isBackground: true, amount: 0, target: BACKGROUND, label: 'Bkgrd' };
  const numeric = /^-?(?:\d+\.?\d*|\.\d+)%?$/.test(text) ? Number.parseFloat(text.replace('%', '')) : null;
  if (numeric !== null && Number.isFinite(numeric)) return { isBackground: false, amount: clampPercent(numeric), target: DEFAULT_YELLOW, label: `${format(clampPercent(numeric))}%` };
  return { isBackground: false, amount: 100, target: colorFromLevel(text), label: text || '100%' };
}

export default function AbsoluteTimeline({ section }: { section: AbsoluteEffectPreviewSection }) {
  const id = useId();
  const channels = Array.isArray(section.channels) ? section.channels : [];
  const defaults = section.defaults ?? { time: 0.5, dwell_time: 0.7, level: '100', grouping: 3, cycle_time: 4.8, bkgrd: 'Bkgrd' };
  const [values, setValues] = useState({ ...defaults });
  const groups = partitionChannels(channels, values.grouping);
  const groupCount = Math.max(1, groups.length);
  const cycle = Math.max(0.1, Math.min(60, Number.isFinite(values.cycle_time) ? values.cycle_time : 0.1));
  const playback = useEffectPlayback(cycle);
  const level = resolveLevel(values.level);
  const groupByChannel = new Map<number, number>();
  groups.forEach((group, index) => group.forEach(channel => groupByChannel.set(channel, index)));

  function updateNumber(field: 'time' | 'dwell_time' | 'grouping' | 'cycle_time', raw: string) {
    if (raw.trim() === '') return;
    const number = Number(raw);
    if (!Number.isFinite(number)) return;
    const value = field === 'grouping' ? Math.max(1, Math.min(channels.length || 1, Math.round(number))) : Math.max(field === 'cycle_time' ? 0.1 : 0, Math.min(60, number));
    setValues(current => ({ ...current, [field]: value }));
  }

  function valueAtGroup(groupIndex: number, time: number) {
    if (level.isBackground) return 0;
    const start = groupIndex * cycle / groupCount;
    const elapsed = time - start;
    if (elapsed < 0) return 0;
    if (values.time > 0 && elapsed < values.time) return level.amount * elapsed / values.time;
    if (elapsed < values.time + values.dwell_time) return level.amount;
    return 0;
  }

  const fixtures = channels.map(channel => {
    const groupIndex = groupByChannel.get(channel) ?? 0;
    const amount = valueAtGroup(groupIndex, playback.currentTime);
    return {
      channel,
      fill: mixHex(BACKGROUND, level.target, amount / 100),
      textColor: amount > 64 ? '#172019' : '#eef2f5',
      label: `${groups[groupIndex]?.length ? `Group ${groupIndex + 1}、` : ''}${level.label}、${format(amount)}%`,
    };
  });

  const width = 1000;
  const left = 175;
  const right = 40;
  const top = 45;
  const laneHeight = 58;
  const height = top + groupCount * laneHeight + 38;
  const x = (time: number) => left + (time / cycle) * (width - left - right);
  const y = (value: number, groupIndex: number) => top + groupIndex * laneHeight + 40 - clampPercent(value) * 0.28;

  return <section className="detail-card absolute-timeline" data-section-type="absolute_effect_preview">
    <h2>{section.title}</h2>
    <p className="muted">設定値の変化を確認する説明用プレビューです。実際の灯体は操作しません。</p>
    <div className="absolute-preview-controls" aria-label="プレビュー設定">
      <label htmlFor={`${id}-time`}>Time<input id={`${id}-time`} aria-label="Time" type="number" min="0" max="60" step="0.1" value={values.time} onChange={event => updateNumber('time', event.target.value)} /></label>
      <label htmlFor={`${id}-dwell`}>Dwell Time<input id={`${id}-dwell`} aria-label="Dwell Time" type="number" min="0" max="60" step="0.1" value={values.dwell_time} onChange={event => updateNumber('dwell_time', event.target.value)} /></label>
      <label htmlFor={`${id}-level`}>Level<input id={`${id}-level`} aria-label="Level" type="text" value={values.level} placeholder="数値・Palette・Bkgrd" onChange={event => setValues(current => ({ ...current, level: event.target.value }))} /></label>
      <label htmlFor={`${id}-grouping`}>Grouping<input id={`${id}-grouping`} aria-label="Grouping" type="number" min="1" max={channels.length || 1} step="1" value={values.grouping} onChange={event => updateNumber('grouping', event.target.value)} /></label>
      <label htmlFor={`${id}-cycle`}>Cycle Time<input id={`${id}-cycle`} aria-label="Cycle Time" type="number" min="0.1" max="60" step="0.1" value={values.cycle_time} onChange={event => updateNumber('cycle_time', event.target.value)} /></label>
      <div className="absolute-bkgrd"><span>Bkgrd</span><p>{values.bkgrd}：Effect適用前の状態へ戻る</p></div>
    </div>
    <FixturePreview fixtures={fixtures} label="Absolute Effect 灯体プレビュー" />
    <EffectPlaybackControls currentTime={playback.currentTime} isPlaying={playback.isPlaying} onPlay={playback.play} onPause={playback.pause} onReset={playback.reset} />
    <div className="absolute-group-summary" aria-live="polite">{groups.map((group, index) => <span key={index}>Group {index + 1}: {group.map(channel => `CH ${channel}`).join('・')}</span>)}</div>
    <div className="timeline-scroll" role="region" aria-label="Absolute Effectの横スクロール時間グラフ" tabIndex={0}>
      <svg className="timeline-svg absolute-timeline-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}>
        <title id={`${id}-title`}>{section.title} 時間グラフ</title>
        <desc id={`${id}-desc`}>Grouping {groupCount}。{groups.map((group, index) => `Group ${index + 1}: Channel ${group.join(', ')}`).join('。')}。現在時刻は{format(playback.currentTime)}秒です。{values.bkgrd}へ戻るプレビューです。</desc>
        <text x={left} y={22}>Cycle Time（秒）</text>
        {Array.from({ length: 6 }, (_, index) => cycle * index / 5).map((time, index) => <g key={index}><line className="time-grid" x1={x(time)} x2={x(time)} y1={35} y2={height - 25} /><text x={x(time)} y={31} textAnchor="middle">{format(time)}</text></g>)}
        {groups.map((group, groupIndex) => {
          const points = Array.from({ length: 101 }, (_, index) => {
            const time = cycle * index / 100;
            return `${index === 0 ? 'M' : 'L'}${x(time).toFixed(2)} ${y(valueAtGroup(groupIndex, time), groupIndex).toFixed(2)}`;
          }).join(' ');
          const baseY = top + groupIndex * laneHeight + 40;
          return <g key={groupIndex}>
            <text x={12} y={top + groupIndex * laneHeight + 20}>Group {groupIndex + 1}</text>
            <text className="start-caption" x={12} y={top + groupIndex * laneHeight + 39}>CH {group.join('・')}</text>
            <line className="off-line" x1={left} x2={width - right} y1={baseY} y2={baseY} />
            <path className="level-line absolute-level-line" d={points} />
            <line className="lane-divider" x1={0} x2={width} y1={baseY + 12} y2={baseY + 12} />
          </g>;
        })}
        <line className="start-line" x1={x(playback.currentTime)} x2={x(playback.currentTime)} y1={28} y2={height - 25} />
      </svg>
    </div>
    <p className="timeline-note">{values.bkgrd}はEffect適用前の状態へ戻る指定です。Levelが色名やPalette名の場合、色を取得できないときは黄色で表示します。</p>
  </section>;
}
