import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  CaptureAssessment,
  CaptureDraft,
  CaptureRecord,
  CapturedPhoto,
  CaptureMode,
  Mission,
} from '@/domain/models';
import { eraFixtures } from '@/mocks/fixtures';
import { captureId } from '@/features/capture/lib/photo';
export type PostAudience = {
  friendIds: string[];
  groups: { id: string; name: string; memberIds: string[] }[];
};
type State = {
  hydrated: boolean;
  draft: CaptureDraft | null;
  records: CaptureRecord[];
  posts: {
    id: string;
    ownerId: string;
    photoUri: string;
    authorName: string;
    subjectName: string;
    caption: string;
    audience?: PostAudience;
  }[];
  publish: (id: string, caption: string, authorName: string, audience: PostAudience) => boolean;
  grantGroup: (postId: string, group: PostAudience['groups'][number]) => void;
  continuation: {
    ownerId: string;
    mode: CaptureMode;
    missionId: string | null;
    sessionId: string;
    evidence: CapturedPhoto[];
  } | null;
  start: (
    photo: CapturedPhoto,
    ownerId: string,
    mode: CaptureMode,
    mission: Mission | null,
  ) => CaptureDraft;
  setScenario: (value: CaptureDraft['scenario']) => void;
  retake: (record?: CaptureRecord) => void;
  settle: (draft: CaptureDraft, result: CaptureAssessment) => CaptureRecord;
};
export const useCaptureStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      draft: null,
      records: [],
      continuation: null,
      posts: [],
      publish: (id, caption, authorName, audience) => {
        const record = get().records.find((r) => r.id === id);
        if (
          !record ||
          (!audience.friendIds.length && !audience.groups.length) ||
          !['accepted', 'completed'].includes(record.verdict) ||
          get().posts.some((p) => p.id === id)
        )
          return false;
        set((s) => ({
          posts: [
            {
              id,
              ownerId: record.ownerId,
              photoUri: record.photo.uri,
              authorName,
              subjectName: record.name,
              caption: caption.trim(),
              audience: {
                friendIds: [...new Set(audience.friendIds)],
                groups: audience.groups.map((g) => ({
                  ...g,
                  memberIds: [...new Set(g.memberIds)],
                })),
              },
            },
            ...s.posts,
          ],
        }));
        return true;
      },
      grantGroup: (postId, group) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId && !p.audience?.groups.some((g) => g.id === group.id)
              ? {
                  ...p,
                  audience: {
                    friendIds: p.audience?.friendIds ?? [],
                    groups: [
                      ...(p.audience?.groups ?? []),
                      { ...group, memberIds: [...group.memberIds] },
                    ],
                  },
                }
              : p,
          ),
        })),
      start: (photo, ownerId, mode, mission) => {
        const old = get().continuation;
        const previous =
          old &&
          old.ownerId === ownerId &&
          old.mode === mode &&
          old.missionId === (mission?.id ?? null)
            ? old
            : null;
        const draft: CaptureDraft = {
          id: captureId(),
          sessionId: previous?.sessionId ?? captureId(),
          ownerId,
          mode,
          mission,
          photo,
          evidence: previous?.evidence ?? [],
          scenario: 'success',
        };
        set({ draft, continuation: null });
        return draft;
      },
      setScenario: (scenario) =>
        set((s) => ({ draft: s.draft ? { ...s.draft, id: captureId(), scenario } : null })),
      retake: (record) => {
        const supplement =
          record && (record.verdict === 'retake_required' || record.verdict === 'unidentified');
        set({
          draft: null,
          continuation: supplement
            ? {
                ownerId: record.ownerId,
                mode: record.mode,
                missionId: record.missionId,
                sessionId: record.sessionId,
                evidence: get()
                  .records.filter(
                    (r) => r.ownerId === record.ownerId && r.sessionId === record.sessionId,
                  )
                  .slice(0, 3)
                  .reverse()
                  .map((r) => r.photo),
              }
            : null,
        });
      },
      settle: (draft, result) => {
        const existing = get().records.find(
          (r) => r.id === draft.id && r.ownerId === draft.ownerId,
        );
        if (existing) return existing;
        const success = result.verdict === 'accepted' || result.verdict === 'completed';
        const owned = get().records.filter((r) => r.ownerId === draft.ownerId);
        const repeatedMission =
          draft.mode === 'mission' &&
          owned.some((r) => r.missionId === draft.mission?.id && r.verdict === 'completed');
        const goal = eraFixtures.find((e) => e.id === result.eraId)?.fragmentGoal ?? 3;
        const fragmentAdded =
          owned.filter((r) => r.fragmentAdded && r.eraId === result.eraId).length < goal &&
          success &&
          !repeatedMission &&
          !!result.eraId &&
          !owned.some(
            (r) =>
              r.fragmentAdded && r.subjectKey === result.subjectKey && r.eraId === result.eraId,
          );
        const record: CaptureRecord = {
          ...result,
          id: draft.id,
          sessionId: draft.sessionId,
          ownerId: draft.ownerId,
          mode: draft.mode,
          photo: draft.photo,
          missionId: draft.mission?.id ?? null,
          xp:
            success && !repeatedMission
              ? draft.mode === 'mission'
                ? (draft.mission?.xp ?? 100)
                : 20
              : 0,
          fragmentAdded,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ records: [record, ...s.records] }));
        return record;
      },
    }),
    {
      name: 'lockulture-captures-v1',
      onRehydrateStorage: () => () => {
        useCaptureStore.setState({ hydrated: true });
      },
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ records, posts }) => ({ records, posts }),
    },
  ),
);
