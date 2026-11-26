import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  TrackType,
} from 'react-native-track-player';

import { getStreamUrl } from '../api/stream';
import { BROADCASTER_LABEL, type Channel } from '../data/channels';

/**
 * react-native-track-player를 감싸는 유일한 파일.
 * 오디오 라이브러리를 바꾸게 되면(예: expo-audio) 이 파일만 고치면 된다.
 */

const ARTWORK = require('../../assets/icon.png');

let setupPromise: Promise<void> | null = null;

export function setupPlayer(): Promise<void> {
  if (!setupPromise) {
    setupPromise = (async () => {
      try {
        await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
      } catch (e) {
        // 핫 리로드 등으로 이미 초기화된 경우는 무시
        if (!String((e as Error)?.message ?? e).includes('already been initialized')) throw e;
      }
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
      });
    })().catch((e) => {
      setupPromise = null;
      throw e;
    });
  }
  return setupPromise;
}

/**
 * 채널의 새 스트림 URL을 받아 재생한다.
 * isLatest()가 false면 사용자가 그 사이 다른 채널을 눌렀다는 뜻이라 아무것도 하지 않는다.
 */
export async function playStream(channel: Channel, isLatest: () => boolean): Promise<void> {
  await setupPlayer();
  const url = await getStreamUrl(channel);
  if (!isLatest()) return;
  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: channel.id,
    url,
    type: TrackType.HLS,
    title: channel.name,
    artist: `${BROADCASTER_LABEL[channel.broadcaster]} · ${channel.frequency}MHz`,
    artwork: ARTWORK,
    isLiveStream: true,
  });
  if (!isLatest()) return;
  await TrackPlayer.play();
}

export async function pauseStream(): Promise<void> {
  await TrackPlayer.pause();
}

export async function stopStream(): Promise<void> {
  await TrackPlayer.reset();
}
