import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { create } from 'zustand';

import { getStreamUrl } from '../api/stream';
import type { Engine, PlaybackStatus } from './types';

/**
 * Expo Go 확인용 엔진 (expo-audio).
 * 앱이 화면에 떠 있을 때의 재생만 확인할 수 있고, 백그라운드 재생·잠금화면 제어는 없다.
 */

const useStatusStore = create<PlaybackStatus>(() => ({ isPlaying: false, isBuffering: false }));

let player: AudioPlayer | null = null;

const engine: Engine = {
  async setup() {
    console.log('[MHz] Expo Go 확인 모드: expo-audio 로 재생합니다 (백그라운드·잠금화면 제어 없음)');
    await setAudioModeAsync({ playsInSilentMode: true });
  },

  async play(channel, isLatest) {
    const url = await getStreamUrl(channel);
    if (!isLatest()) return;
    useStatusStore.setState({ isBuffering: true });

    if (!player) {
      player = createAudioPlayer({ uri: url });
      player.addListener('playbackStatusUpdate', (status) => {
        useStatusStore.setState({ isPlaying: status.playing, isBuffering: status.isBuffering });
      });
    } else {
      player.replace({ uri: url });
    }
    player.play();
  },

  async pause() {
    player?.pause();
  },

  async stop() {
    player?.pause();
  },

  async isActive() {
    return player?.playing ?? false;
  },

  useStatus() {
    return useStatusStore();
  },
};

export default engine;
