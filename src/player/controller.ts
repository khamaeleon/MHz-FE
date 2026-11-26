import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

import { CHANNELS, getChannel } from '../data/channels';
import { usePlayerStore } from '../store/player';
import { usePrefs } from '../store/prefs';
import { isStreamActive, pauseStream, playStream, stopStream } from './engine';

/** 화면과 잠금화면(service.ts)이 같이 쓰는 재생 명령 모음 */

let requestSeq = 0;
let retriedFor: string | null = null;

type StartOptions = { fromUser?: boolean; isRetry?: boolean };

async function blockedByCellular(fromUser: boolean): Promise<boolean> {
  if (usePrefs.getState().settings.cellular) return false;
  const net = await NetInfo.fetch();
  if (net.type !== 'cellular') return false;
  if (fromUser) {
    Alert.alert(
      '셀룰러 데이터 재생이 꺼져 있어요',
      '마이 > 셀룰러 데이터로 재생을 켜면 Wi-Fi가 아닐 때도 들을 수 있어요.',
    );
  }
  return true;
}

async function start(id: string, { fromUser = false, isRetry = false }: StartOptions) {
  const channel = getChannel(id);
  if (!channel) return;
  if (await blockedByCellular(fromUser)) return;

  const seq = ++requestSeq;
  if (!isRetry) retriedFor = null;
  usePlayerStore.setState({ currentId: id, loading: true, error: null });
  usePrefs.getState().markPlayed(id);

  try {
    await playStream(channel, () => seq === requestSeq);
    if (seq === requestSeq) usePlayerStore.setState({ loading: false });
  } catch (e) {
    if (seq !== requestSeq) return;
    const message = e instanceof Error ? e.message : '알 수 없는 오류';
    usePlayerStore.setState({ loading: false, error: message });
    if (fromUser) Alert.alert('재생할 수 없어요', message);
  }
}

export function playChannelById(id: string, opts: { fromUser?: boolean } = {}) {
  return start(id, { fromUser: opts.fromUser });
}

/** 라이브는 멈춘 지점부터 이어 들을 수 없으니, 다시 재생할 때 새 URL로 현재 방송에 붙는다. */
export async function resume(fromUser = false) {
  const { currentId } = usePlayerStore.getState();
  if (currentId) await start(currentId, { fromUser });
}

export async function pause() {
  await pauseStream();
}

export async function stop() {
  requestSeq++;
  await stopStream();
  usePlayerStore.setState({ loading: false });
}

export async function togglePlay() {
  const active = await isStreamActive();
  if (active || usePlayerStore.getState().loading) await pause();
  else await resume(true);
}

function step(delta: number, fromUser: boolean) {
  const { currentId } = usePlayerStore.getState();
  const index = Math.max(0, CHANNELS.findIndex((c) => c.id === currentId));
  const next = CHANNELS[(index + delta + CHANNELS.length) % CHANNELS.length];
  return start(next.id, { fromUser });
}

export const playNext = (fromUser = false) => step(1, fromUser);
export const playPrev = (fromUser = false) => step(-1, fromUser);

/** 재생 오류가 나면 토큰이 만료됐을 수 있으니 새 URL로 한 번만 다시 시도한다. */
export async function retryCurrent() {
  const { currentId } = usePlayerStore.getState();
  if (!currentId) return;
  if (retriedFor === currentId) {
    usePlayerStore.setState({ loading: false, error: '스트림이 끊겼어요. 잠시 후 다시 시도해 주세요.' });
    return;
  }
  retriedFor = currentId;
  await start(currentId, { isRetry: true });
}
