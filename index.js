import 'expo-router/entry';

import { isExpoGo } from './src/player/env';

// 잠금화면·이어폰 버튼용 백그라운드 서비스 (Expo Go 에는 track-player 가 없어서 등록하지 않음)
if (!isExpoGo) {
  const TrackPlayer = require('react-native-track-player').default;
  const { PlaybackService } = require('./src/player/service');
  TrackPlayer.registerPlaybackService(() => PlaybackService);
}
