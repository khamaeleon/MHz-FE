export type Broadcaster = 'kbs' | 'mbc' | 'sbs';

export type Resolver =
  | { type: 'kbs'; code: string }
  | { type: 'mbc'; channel: string }
  | { type: 'sbs'; path: string };

export type Channel = {
  id: string;
  broadcaster: Broadcaster;
  name: string;
  /** 카드 아트워크에 크게 쓰는 짧은 이름 */
  shortName: string;
  /** 서울 기준 FM 주파수(MHz) */
  frequency: string;
  /** 카드·플레이어 배경 그라데이션 */
  colors: [string, string];
  resolver: Resolver;
};

export const BROADCASTER_LABEL: Record<Broadcaster, string> = {
  kbs: 'KBS',
  mbc: 'MBC',
  sbs: 'SBS',
};

export const CHANNELS: Channel[] = [
  {
    id: 'kbs-1radio',
    broadcaster: 'kbs',
    name: 'KBS 1라디오',
    shortName: '1Radio',
    frequency: '97.3',
    colors: ['#2B3A67', '#11162B'],
    resolver: { type: 'kbs', code: '21' },
  },
  {
    id: 'kbs-2radio',
    broadcaster: 'kbs',
    name: 'KBS 2라디오',
    shortName: 'Happy FM',
    frequency: '106.1',
    colors: ['#E0743A', '#3A1A0E'],
    resolver: { type: 'kbs', code: '22' },
  },
  {
    id: 'kbs-cool',
    broadcaster: 'kbs',
    name: 'KBS 쿨FM',
    shortName: 'Cool FM',
    frequency: '89.1',
    colors: ['#1FA2D6', '#0B2A3D'],
    resolver: { type: 'kbs', code: '25' },
  },
  {
    id: 'kbs-classic',
    broadcaster: 'kbs',
    name: 'KBS 클래식FM',
    shortName: 'Classic',
    frequency: '93.1',
    colors: ['#7A5C3E', '#21180F'],
    resolver: { type: 'kbs', code: '24' },
  },
  {
    id: 'mbc-sfm',
    broadcaster: 'mbc',
    name: 'MBC 표준FM',
    shortName: 'MBC 표준',
    frequency: '95.9',
    colors: ['#6A5CFF', '#1B1640'],
    resolver: { type: 'mbc', channel: 'sfm' },
  },
  {
    id: 'mbc-fm4u',
    broadcaster: 'mbc',
    name: 'MBC FM4U',
    shortName: 'FM4U',
    frequency: '91.9',
    colors: ['#E5484D', '#3D1214'],
    resolver: { type: 'mbc', channel: 'mfm' },
  },
  {
    id: 'sbs-love',
    broadcaster: 'sbs',
    name: 'SBS 러브FM',
    shortName: 'Love FM',
    frequency: '103.5',
    colors: ['#E85D9E', '#3B1229'],
    resolver: { type: 'sbs', path: 'lovepc/lovefm' },
  },
  {
    id: 'sbs-power',
    broadcaster: 'sbs',
    name: 'SBS 파워FM',
    shortName: 'Power FM',
    frequency: '107.7',
    colors: ['#F5A524', '#3D2706'],
    resolver: { type: 'sbs', path: 'powerpc/powerfm' },
  },
];

export function getChannel(id: string | null | undefined): Channel | undefined {
  if (!id) return undefined;
  return CHANNELS.find((c) => c.id === id);
}
