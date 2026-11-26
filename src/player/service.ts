import TrackPlayer, { Event } from 'react-native-track-player';

import { pause, playNext, playPrev, resume, retryCurrent, stop } from './controller';

/** 잠금화면·제어센터·이어폰 버튼 이벤트를 받는 백그라운드 서비스 (index.js에서 등록) */
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    resume();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    pause();
  });
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    stop();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    playNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    playPrev();
  });
  TrackPlayer.addEventListener(Event.PlaybackError, () => {
    retryCurrent();
  });
}
