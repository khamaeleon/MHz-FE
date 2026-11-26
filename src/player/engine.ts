import { isExpoGo } from './env';
import type { Engine } from './types';

/**
 * 오디오 엔진 선택.
 * - 개발 빌드·실제 앱: react-native-track-player (engine.trackplayer.ts)
 * - Expo Go: expo-audio (engine.expoaudio.ts) — 화면·재생 확인용
 *
 * require 를 조건문 안에 두어, Expo Go 에서는 track-player 모듈 코드가 아예 실행되지 않게 한다.
 * 감지가 빗나가 track-player 를 불러오다 실패해도 expo-audio 로 넘어간다.
 */
function loadEngine(): Engine {
  if (!isExpoGo) {
    try {
      return require('./engine.trackplayer').default;
    } catch (e) {
      console.warn('[MHz] track-player 를 불러오지 못해 expo-audio 확인 모드로 전환합니다.', e);
    }
  }
  return require('./engine.expoaudio').default;
}

const engine = loadEngine();

export const setupPlayer = () => engine.setup();
export const playStream = engine.play;
export const pauseStream = () => engine.pause();
export const stopStream = () => engine.stop();
export const isStreamActive = () => engine.isActive();
export const useEngineStatus = engine.useStatus;
