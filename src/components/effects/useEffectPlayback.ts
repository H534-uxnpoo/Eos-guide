import { useCallback, useEffect, useRef, useState } from 'react';

export function useEffectPlayback(duration: number) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTimeRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const stopFrame = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const cycle = Math.max(0.1, Number.isFinite(duration) ? duration : 0.1);
    const start = performance.now() - currentTimeRef.current * 1000;
    const tick = (now: number) => {
      const elapsed = Math.max(0, (now - start) / 1000);
      const next = elapsed % cycle;
      currentTimeRef.current = next;
      setCurrentTime(next);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return stopFrame;
  }, [duration, isPlaying, stopFrame]);

  const play = useCallback(() => {
    const cycle = Math.max(0.1, Number.isFinite(duration) ? duration : 0.1);
    if (currentTimeRef.current >= cycle) {
      currentTimeRef.current = 0;
      setCurrentTime(0);
    }
    setIsPlaying(true);
  }, [duration]);

  const pause = useCallback(() => {
    stopFrame();
    setIsPlaying(false);
  }, [stopFrame]);

  const reset = useCallback(() => {
    stopFrame();
    setIsPlaying(false);
    currentTimeRef.current = 0;
    setCurrentTime(0);
  }, [stopFrame]);

  return { currentTime, isPlaying, play, pause, reset };
}
