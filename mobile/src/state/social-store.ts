import { useCaptureStore } from '@/state/capture-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
export const people = [
  {
    id: 'an',
    name: 'Minh An',
    handle: 'minhan',
    bio: 'Thích những câu chuyện phía sau tên đường.',
    xp: 340,
  },
  {
    id: 'linh',
    name: 'Thảo Linh',
    handle: 'thaolinh',
    bio: 'Khám phá Huế qua từng món ăn.',
    xp: 260,
  },
  {
    id: 'khoa',
    name: 'Đăng Khoa',
    handle: 'dangkhoa',
    bio: 'Đi bộ, chụp ảnh và tìm dấu xưa.',
    xp: 180,
  },
  {
    id: 'vy',
    name: 'Tường Vy',
    handle: 'tuongvy',
    bio: 'Một ngày, một điều mới về văn hóa.',
    xp: 120,
  },
  {
    id: 'nam',
    name: 'Hoài Nam',
    handle: 'hoainam',
    bio: 'Hẹn nhau ở hành trình tiếp theo.',
    xp: 80,
  },
];
export type Relation = 'friend' | 'incoming' | 'outgoing';
export type Group = {
  id: string;
  name: string;
  memberIds: string[];
  ownerId: string;
  postIds: string[];
};
type State = {
  hydrated: boolean;
  relations: Record<string, Relation>;
  groups: Group[];
  relate: (id: string, next: Relation | null) => void;
  createGroup: (name: string, members: string[]) => string | null;
  renameGroup: (id: string, name: string) => void;
  addMembers: (id: string, members: string[]) => void;
  removeMember: (id: string, member: string) => void;
  leaveGroup: (id: string) => void;
  sharePost: (groupId: string, postId: string) => void;
};
export const useSocialStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      relations: { an: 'friend', linh: 'friend', khoa: 'incoming', vy: 'outgoing' },
      groups: [
        {
          id: 'hue',
          name: 'Hẹn nhau ở Huế',
          memberIds: ['mock-user', 'an', 'linh'],
          ownerId: 'mock-user',
          postIds: [],
        },
        {
          id: 'weekend',
          name: 'Cuối tuần đi đâu?',
          memberIds: ['mock-user', 'an'],
          ownerId: 'an',
          postIds: [],
        },
      ],
      relate: (id, next) => {
        if (!people.some((p) => p.id === id)) return;
        set((s) => {
          const relations = { ...s.relations };
          if (next) relations[id] = next;
          else delete relations[id];
          return { relations };
        });
      },
      createGroup: (name, members) => {
        if (!name.trim() || name.trim().length > 50) return null;
        const id = `group-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const valid = [...new Set(members)].filter((m) => get().relations[m] === 'friend');
        set((s) => ({
          groups: [
            ...s.groups,
            {
              id,
              name: name.trim(),
              memberIds: ['mock-user', ...valid],
              ownerId: 'mock-user',
              postIds: [],
            },
          ],
        }));
        return id;
      },
      renameGroup: (id, name) => {
        if (!name.trim() || name.trim().length > 50) return;
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === id && g.ownerId === 'mock-user' ? { ...g, name: name.trim() } : g,
          ),
        }));
      },
      addMembers: (id, members) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === id && g.ownerId === 'mock-user'
              ? {
                  ...g,
                  memberIds: [
                    ...new Set([
                      ...g.memberIds,
                      ...members.filter((m) => s.relations[m] === 'friend'),
                    ]),
                  ],
                }
              : g,
          ),
        })),
      removeMember: (id, member) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === id && g.ownerId === 'mock-user' && member !== g.ownerId
              ? { ...g, memberIds: g.memberIds.filter((m) => m !== member) }
              : g,
          ),
        })),
      leaveGroup: (id) => set((s) => ({ groups: s.groups.filter((g) => g.id !== id) })),
      sharePost: (id, postId) => {
        const group = get().groups.find((g) => g.id === id && g.memberIds.includes('mock-user'));
        const post = useCaptureStore
          .getState()
          .posts.find((p) => p.id === postId && p.ownerId === 'mock-user');
        if (!group || !post) return;
        useCaptureStore
          .getState()
          .grantGroup(postId, { id: group.id, name: group.name, memberIds: group.memberIds });
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === id && !g.postIds.includes(postId)
              ? { ...g, postIds: [...g.postIds, postId] }
              : g,
          ),
        }));
      },
    }),
    {
      name: 'lockulture-social-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ relations, groups }) => ({ relations, groups }),
      onRehydrateStorage: () => () => useSocialStore.setState({ hydrated: true }),
    },
  ),
);
