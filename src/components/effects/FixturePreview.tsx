import type { CSSProperties } from 'react';

export interface FixtureState {
  channel: number;
  fill: string;
  textColor?: string;
  label: string;
}

export default function FixturePreview({ fixtures, label = '灯体プレビュー' }: { fixtures: FixtureState[]; label?: string }) {
  const safeFixtures = Array.isArray(fixtures) ? fixtures : [];
  return <section className="effect-fixture-preview" aria-label={label}>
    <div className="effect-preview-heading"><h3>{label}</h3><span>{safeFixtures.length} fixtures</span></div>
    <ul className="effect-fixture-row" aria-live="polite">
      {safeFixtures.map(fixture => <li key={fixture.channel} aria-label={`Channel ${fixture.channel}: ${fixture.label}`}>
        <span className="fixture-orb" style={{ backgroundColor: fixture.fill, color: fixture.textColor ?? '#eef2f5' } as CSSProperties}>{fixture.channel}</span>
        <span className="fixture-channel-label">CH {fixture.channel}</span>
      </li>)}
    </ul>
  </section>;
}
