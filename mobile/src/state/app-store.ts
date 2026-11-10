import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { MockUser, Mission } from '@/domain/models';

type AppState = {
  activeMission: Mission | null;
  clearMission: (id: string) => void;
  setMission: (mission: Mission) => void;
  revealHint: (id: string) => void;
  revealAnswer: (id: string) => void;
  hydrated: boolean;
  mockUser: MockUser | null;
  selectedEraId: string | null;
  setHydrated: () => void;
  enterMockSession: () => void;
  signOut: () => void;
  selectEra: (id: string) => void;
};
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      clearMission: (id) =>
        set((s) => ({ activeMission: s.activeMission?.id === id ? null : s.activeMission })),
      activeMission: null,
      setMission: (activeMission) => set({ activeMission }),
      revealHint: (id) =>
        set((s) => ({
          activeMission:
            s.activeMission?.id === id
              ? {
                  ...s.activeMission,
                  revealedHints: Math.min(
                    s.activeMission.hints.length,
                    s.activeMission.revealedHints + 1,
                  ),
                }
              : s.activeMission,
        })),
      revealAnswer: (id) =>
        set((s) => ({
          activeMission:
            s.activeMission?.id === id
              ? { ...s.activeMission, answerRevealed: true }
              : s.activeMission,
        })),
      hydrated: false,
      mockUser: null,
      selectedEraId: null,
      setHydrated: () => set({ hydrated: true }),
      enterMockSession: () => set({ mockUser: { id: 'mock-user', displayName: 'Lữ khách' } }),
      signOut: () => set({ mockUser: null, selectedEraId: null, activeMission: null }),
      selectEra: (id) => set({ selectedEraId: id }),
    }),
    {
      name: 'lockulture-app-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ mockUser, selectedEraId, activeMission }) => ({
        mockUser,
        selectedEraId,
        activeMission,
      }),
      onRehydrateStorage: () => (_state, error) => {
        // A damaged/unavailable local store should not block the app forever.
        if (error) console.warn('Không khôi phục được phiên mock; dùng trạng thái ban đầu.');
        useAppStore.getState().setHydrated();
      },
    },
  ),
);
