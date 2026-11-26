import type { Channel } from '../data/channels';

export type PlaybackStatus = {
  isPlaying: boolean;
  isBuffering: boolean;
};

/** 오디오 엔진이 지켜야 할 형태. 실제 앱(native)과 Expo Go 확인용(expo-go) 두 가지 구현이 있다. */
export type Engine = {
  setup(): Promise<void>;
  /** isLatest()가 false면 사용자가 그 사이 다른 채널을 눌렀다는 뜻이라 아무것도 하지 않는다. */
  play(channel: Channel, isLatest: () => boolean): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  isActive(): Promise<boolean>;
  /** React hook */
  useStatus(): PlaybackStatus;
};
