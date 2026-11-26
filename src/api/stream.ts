import type { Channel } from '../data/channels';

/**
 * 방송사 API에서 일시적으로만 유효한 HLS(m3u8) URL을 받아온다.
 * URL은 만료되므로 캐시하지 말고 재생할 때마다 새로 호출한다.
 * 참고: https://blog.bsod.kr/137
 */

const TIMEOUT_MS = 8000;

export class StreamError extends Error {}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new StreamError(`방송사 서버 응답 오류 (HTTP ${res.status})`);
    return res;
  } catch (e) {
    if (e instanceof StreamError) throw e;
    throw new StreamError('방송사 서버에 연결하지 못했어요');
  } finally {
    clearTimeout(timer);
  }
}

/** JSON 어디에 있든 key 이름이 일치하는 첫 번째 http URL 문자열을 찾는다. */
function findUrlByKey(value: unknown, key: string): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findUrlByKey(item, key);
      if (found) return found;
    }
    return undefined;
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const direct = record[key];
    if (typeof direct === 'string' && direct.startsWith('http')) return direct;
    for (const child of Object.values(record)) {
      const found = findUrlByKey(child, key);
      if (found) return found;
    }
  }
  return undefined;
}

const M3U8_PATTERN = /https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/;

function extractM3u8(text: string): string | undefined {
  const match = text.match(M3U8_PATTERN);
  return match ? match[0].replace(/&amp;/g, '&') : undefined;
}

async function resolveKbs(code: string): Promise<string> {
  const res = await fetchWithTimeout(
    `https://cfpwwwapi.kbs.co.kr/api/v1/landing/live/channel_code/${code}`,
  );
  const json: unknown = await res.json();
  // 블로그 본문(channel.item)과 예제(channel_item[0])의 필드명이 달라서 구조와 무관하게 찾는다.
  const url = findUrlByKey(json, 'service_url');
  if (!url) throw new StreamError('KBS 응답에서 스트림 주소를 찾지 못했어요');
  return url;
}

async function resolveMbc(channel: string): Promise<string> {
  const res = await fetchWithTimeout(
    `https://sminiplay.imbc.com/aacplay.ashx?agent=webapp&channel=${channel}`,
  );
  const url = extractM3u8(await res.text());
  if (!url) throw new StreamError('MBC 응답에서 스트림 주소를 찾지 못했어요');
  return url;
}

async function resolveSbs(path: string): Promise<string> {
  const res = await fetchWithTimeout(
    `https://apis.sbs.co.kr/play-api/1.0/livestream/${path}?protocol=hls&ssl=Y`,
  );
  const url = extractM3u8(await res.text());
  if (!url) throw new StreamError('SBS 응답에서 스트림 주소를 찾지 못했어요');
  return url;
}

export async function getStreamUrl(channel: Channel): Promise<string> {
  const r = channel.resolver;
  switch (r.type) {
    case 'kbs':
      return resolveKbs(r.code);
    case 'mbc':
      return resolveMbc(r.channel);
    case 'sbs':
      return resolveSbs(r.path);
  }
}
