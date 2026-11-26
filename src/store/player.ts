import { create } from 'zustand';

type PlayerState = {
  currentId: string | null;
  /** 스트림 URL을 받아오는 중 */
  loading: boolean;
  error: string | null;
};

export const usePlayerStore = create<PlayerState>(() => ({
  currentId: null,
  loading: false,
  error: null,
}));
