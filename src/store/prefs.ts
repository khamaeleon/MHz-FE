import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** 기기에 저장하는 개인 데이터: 즐겨찾기, 최근 채널, 설정 */

export type Settings = {
  cellular: boolean;
  autoplay: boolean;
  largeText: boolean;
};

type PrefsState = {
  favorites: string[];
  recentChannels: string[];
  lastChannelId: string | null;
  settings: Settings;
  toggleFavorite: (id: string) => void;
  markPlayed: (id: string) => void;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      favorites: [],
      recentChannels: [],
      lastChannelId: null,
      settings: { cellular: true, autoplay: true, largeText: false },
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      markPlayed: (id) =>
        set((s) => ({
          lastChannelId: id,
          recentChannels: [id, ...s.recentChannels.filter((r) => r !== id)].slice(0, 10),
        })),
      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),
    }),
    {
      name: 'mhz-prefs',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        favorites: s.favorites,
        recentChannels: s.recentChannels,
        lastChannelId: s.lastChannelId,
        settings: s.settings,
      }),
    },
  ),
);

export function waitForPrefs(): Promise<void> {
  if (usePrefs.persist.hasHydrated()) return Promise.resolve();
  return new Promise((resolve) => {
    const unsub = usePrefs.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}
