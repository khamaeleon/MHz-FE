import { isExpoGo } from './env';
import type { Engine } from './types';

/**
 * 오디오 엔진 선택.
 * - 개발 빌드·실제 앱: react-native-track-player (engine.native.ts)
 * - Expo Go: expo-audio (engine.expo-go.ts) — 화면·재생 확인용
 *
 * require 를 조건문 안에 두어, Expo Go 에서는 track-player 모듈 코드가 아예 실행되지 않게 한다.
 */
const engine: Engine = isExpoGo
  ? require('./engine.expo-go').default
  : require('./engine.native').default;

export const setupPlayer = () => engine.setup();
export const playStream = engine.play;
export const pauseStream = () => engine.pause();
export const stopStream = () => engine.stop();
export const isStreamActive = () => engine.isActive();
export const useEngineStatus = engine.useStatus;
