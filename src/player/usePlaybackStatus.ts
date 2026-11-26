import { State, usePlaybackState } from 'react-native-track-player';

import { usePlayerStore } from '../store/player';

export function usePlaybackStatus() {
  const { state } = usePlaybackState();
  const loading = usePlayerStore((s) => s.loading);
  return {
    isPlaying: state === State.Playing,
    isBuffering: loading || state === State.Buffering || state === State.Loading,
  };
}
