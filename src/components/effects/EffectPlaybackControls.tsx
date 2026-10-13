interface EffectPlaybackControlsProps {
  currentTime: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function EffectPlaybackControls({ currentTime, isPlaying, onPlay, onPause, onReset }: EffectPlaybackControlsProps) {
  return <div className="effect-playback-controls" role="group" aria-label="プレビュー再生操作">
    <button type="button" aria-label="灯体プレビューを再生" onClick={onPlay} disabled={isPlaying}>▶ 再生</button>
    <button type="button" aria-label="灯体プレビューを一時停止" onClick={onPause} disabled={!isPlaying}>⏸ 一時停止</button>
    <button type="button" aria-label="灯体プレビューを先頭へ戻す" onClick={onReset}>↺ 先頭へ</button>
    <output className="effect-current-time" aria-live="polite" aria-label="現在時刻">現在 {currentTime.toFixed(1)}秒</output>
  </div>;
}
