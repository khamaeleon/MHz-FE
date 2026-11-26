import { usePlayerStore } from '../store/player';
import { useEngineStatus } from './engine';

export function usePlaybackStatus() {
  const { isPlaying, isBuffering } = useEngineStatus();
  const loading = usePlayerStore((s) => s.loading);
  return { isPlaying, isBuffering: loading || isBuffering };
}
