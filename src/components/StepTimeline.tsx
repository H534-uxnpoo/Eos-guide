import { useId, useState } from 'react';
import type { StepTimelineSection, TimelineField } from '../types';
const format = (value: number) => Number(value.toFixed(2)).toString();
export default function StepTimeline({ section }: { section: StepTimelineSection }) {
  const [values, setValues] = useState(section.defaults);
  const id = useId();
  const duration = values.in_time + values.dwell_time + values.decay_time;
  const end = Math.max(1, Math.max(0, section.channels.length - 1) * values.step_time + duration + 0.5);
  const width = 1000, left = 135, right = 45, top = 85, laneHeight = 116;
  const height = top + section.channels.length * laneHeight + 60;
  const x = (time: number) => left + time / end * (width - left - right);
  const phases = [
    { field: 'in_time', label: 'In', className: 'phase-in', dash: undefined },
    { field: 'dwell_time', label: 'Dwell', className: 'phase-dwell', dash: '7 3' },
    { field: 'decay_time', label: 'Decay', className: 'phase-decay', dash: '2 3' },
  ] as const;
  function update(field: TimelineField, raw: string) {
    if (raw.trim() === '') return;
    const next = Number(raw);
    if (!Number.isFinite(next)) return;
    setValues(previous => ({ ...previous, [field]: Math.min(field.endsWith('state') ? 100 : 60, Math.max(0, next)) }));
  }
  return <section className="detail-card step-timeline" data-section-type="step_timeline">
    <h2>{section.title}</h2><p>{section.description}</p>
    <div className="timeline-controls">{section.editable.map(field => <label key={field} htmlFor={`${id}-${field}`}><span>{section.labels[field]}</span><div><input id={`${id}-${field}`} aria-label={section.labels[field]} type="number" min="0" max={field.endsWith('state') ? 100 : 60} step={field.endsWith('state') ? 1 : 0.1} value={values[field]} onChange={event => update(field, event.target.value)} /><span>{field.endsWith('state') ? '%' : section.axis.unit}</span></div></label>)}</div>
    <button className="timeline-reset" onClick={() => setValues({ ...section.defaults })}>初期値に戻す</button>
    <p className="muted small">時間は0〜60秒、値は0〜100%で確認できます。図は横にスクロールできます。</p>
    <div className="timeline-legend">{phases.map(phase => <span className={phase.className} key={phase.field}>{section.labels[phase.field]}: {format(values[phase.field])}{section.axis.unit}</span>)}</div>
    <p className="small">{section.labels.on_state}: {format(values.on_state)}% ／ {section.labels.off_state}: {format(values.off_state)}%</p>
    <div className="timeline-scroll" role="region" aria-label={`${section.title}の横スクロール図`} tabIndex={0}>
      <svg className="timeline-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
        <title id={`${id}-title`}>{section.title}</title>
        <desc id={`${id}-description`}>{section.description} {section.channels.map((channel, index) => `チャンネル${channel}: ${format(index * values.step_time)}秒から開始`).join('。')}。{section.labels.in_time} {values.in_time}秒、{section.labels.dwell_time} {values.dwell_time}秒、{section.labels.decay_time} {values.decay_time}秒。{section.labels.off_state} {values.off_state}%から{section.labels.on_state} {values.on_state}%へ変化し、元へ戻ります。</desc>
        <text x={left} y={23}>{section.axis.label}（{section.axis.unit}）</text>
        {Array.from({ length: 7 }, (_, index) => end * index / 6).map((time, index) => <g key={index}><line className="time-grid" x1={x(time)} x2={x(time)} y1={55} y2={height - 45}/><text x={x(time)} y={47} textAnchor="middle">{format(time)}</text></g>)}
        {section.channels.map((channel, index) => {
          const start = index * values.step_time;
          const inEnd = start + values.in_time, dwellEnd = inEnd + values.dwell_time, finish = dwellEnd + values.decay_time;
          const laneTop = top + index * laneHeight;
          const y = (level: number) => laneTop + 84 - level * 0.55;
          const off = y(values.off_state), on = y(values.on_state);
          const segments = [[start, inEnd, off, on], [inEnd, dwellEnd, on, on], [dwellEnd, finish, on, off]];
          return <g className="timeline-lane" key={channel} data-channel={channel} data-start={format(start)} data-end={format(finish)}>
            <title>CH {channel}: 開始 {format(start)}秒 / 終了 {format(finish)}秒</title>
            <text x={10} y={laneTop + 35}>CH {channel}</text><text x={10} y={laneTop + 58} className="start-caption">開始 {format(start)}秒</text>
            <line className="off-line" x1={left} x2={x(start)} y1={off} y2={off}/><line className="off-line" x1={x(finish)} x2={width - right} y1={off} y2={off}/>
            {segments.map(([from, to, y1, y2], phaseIndex) => <g className={phases[phaseIndex].className} key={phaseIndex}><rect x={x(from)} y={laneTop + 23} width={Math.max(0, x(to) - x(from))} height={67}/><line className="level-line" x1={x(from)} x2={x(to)} y1={y1} y2={y2} strokeDasharray={phases[phaseIndex].dash}/>{x(to) - x(from) > 48 && <text className="phase-label" x={(x(from) + x(to)) / 2} y={laneTop + 17} textAnchor="middle">{phases[phaseIndex].label}</text>}</g>)}
            <line className="start-line" x1={x(start)} x2={x(start)} y1={laneTop + 20} y2={laneTop + 94}/><circle cx={x(start)} cy={off} r={4}/>
            <line className="lane-divider" x1={0} x2={width} y1={laneTop + 107} y2={laneTop + 107}/>
          </g>;
        })}
      </svg>
    </div>
    <p className="timeline-note warning">{section.note}</p>
  </section>;
}
