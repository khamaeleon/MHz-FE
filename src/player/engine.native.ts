import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  State,
  TrackType,
  usePlaybackState,
} from 'react-native-track-player';

import { getStreamUrl } from '../api/stream';
import { BROADCASTER_LABEL } from '../data/channels';
import type { Engine } from './types';

/** 실제 앱용 엔진: 백그라운드 재생, 잠금화면·제어센터·이어폰 버튼 지원 */

const ARTWORK = require('../../assets/icon.png');

let setupPromise: Promise<void> | null = null;

const engine: Engine = {
  setup() {
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
  },

  async play(channel, isLatest) {
    await engine.setup();
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
  },

  async pause() {
    await TrackPlayer.pause();
  },

  async stop() {
    await TrackPlayer.reset();
  },

  async isActive() {
    const { state } = await TrackPlayer.getPlaybackState();
    return state === State.Playing || state === State.Buffering || state === State.Loading;
  },

  useStatus() {
    const { state } = usePlaybackState();
    return {
      isPlaying: state === State.Playing,
      isBuffering: state === State.Buffering || state === State.Loading,
    };
  },
};

export default engine;
