const paths: Record<string, string> = {
  power: 'M12 3v9 M6.3 5.8a8 8 0 1 0 11.4 0',
  settings: 'M4 7h16 M4 17h16 M8 4v6 M16 14v6',
  cable: 'M8 3v5 M16 3v5 M6 8h12v4a6 6 0 0 1-6 6v4 M12 18v-4',
  monitor: 'M3 4h18v13H3z M8 21h8 M12 17v4',
  sliders: 'M5 3v18 M12 3v18 M19 3v18 M2 8h6 M9 16h6 M16 7h6',
  swatches: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  play: 'm8 4 12 8-12 8z', faders: 'M5 3v18 M12 3v18 M19 3v18 M2 6h6v4H2z M9 14h6v4H9z M16 8h6v4h-6z',
  sparkles: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
  layout: 'M3 3h18v18H3z M3 9h18 M10 9v12',
  wrench: 'M14 3a6 6 0 0 0-6 8L3 17a3 3 0 0 0 4 4l6-6a6 6 0 0 0 8-7l-4 4-5-5 4-4z',
  keyboard: 'M2 5h20v14H2z M5 9h1 M9 9h1 M13 9h1 M17 9h1 M5 13h1 M9 13h1 M13 13h1 M17 13h1 M7 16h10',
  bookmark: 'M6 3h12v19l-6-4-6 4z', search: 'M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  arrow: 'm9 5 7 7-7 7', back: 'm15 5-7 7 7 7', home: 'm3 10 9-8 9 8 M5 9v12h14V9 M9 21v-8h6v8',
};
export default function Icon({ name, size = 24 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.monitor} /></svg>;
}
