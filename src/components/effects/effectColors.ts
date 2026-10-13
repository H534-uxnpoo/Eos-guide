export const clampPercent = (value: number) => Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

function rgbFromHex(hex: string): [number, number, number] | null {
  const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const raw = match[1].length === 3 ? [...match[1]].map(char => char + char).join('') : match[1];
  return [0, 2, 4].map(index => Number.parseInt(raw.slice(index, index + 2), 16)) as [number, number, number];
}

export function mixHex(background: string, target: string, amount: number): string {
  const from = rgbFromHex(background);
  const to = rgbFromHex(target);
  if (!from || !to) return target;
  const ratio = Math.min(1, Math.max(0, amount));
  const channels = from.map((value, index) => Math.round(value + (to[index] - value) * ratio));
  return `#${channels.map(value => value.toString(16).padStart(2, '0')).join('')}`;
}
