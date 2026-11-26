import 'expo-router/entry';

import { isExpoGo } from './src/player/env';

// 잠금화면·이어폰 버튼용 백그라운드 서비스 (Expo Go 에는 track-player 가 없어서 등록하지 않음)
if (!isExpoGo) {
  try {
    const TrackPlayer = require('react-native-track-player').default;
    const { PlaybackService } = require('./src/player/service');
    TrackPlayer.registerPlaybackService(() => PlaybackService);
  } catch (e) {
    console.warn('[MHz] 재생 서비스를 등록하지 못했어요 (Expo Go 이거나 네이티브 모듈 없음).', e);
  }
}
