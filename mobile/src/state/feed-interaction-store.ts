import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export const reactions = ['❤️', '👏', '😮'] as const;
export type Comment = { id: string; authorId: string; authorName: string; text: string };
type State = {
  reactions: Record<string, string>;
  comments: Record<string, Comment[]>;
  react: (key: string, emoji: string) => void;
  comment: (key: string, authorId: string, authorName: string, text: string) => void;
  remove: (key: string, id: string, authorId: string) => void;
};
export const useFeedInteractions = create<State>()(
  persist(
    (set) => ({
      reactions: {},
      comments: {},
      react: (key, emoji) => {
        if (!reactions.includes(emoji as (typeof reactions)[number])) return;
        set((s) => {
          const next = { ...s.reactions };
          if (next[key] === emoji) delete next[key];
          else next[key] = emoji;
          return { reactions: next };
        });
      },
      comment: (key, authorId, authorName, text) => {
        if (!text.trim() || text.trim().length > 300) return;
        set((s) => ({
          comments: {
            ...s.comments,
            [key]: [
              ...(s.comments[key] ?? []),
              { id: `${Date.now()}-${Math.random()}`, authorId, authorName, text: text.trim() },
            ],
          },
        }));
      },
      remove: (key, id, authorId) =>
        set((s) => ({
          comments: {
            ...s.comments,
            [key]: (s.comments[key] ?? []).filter((c) => c.id !== id || c.authorId !== authorId),
          },
        })),
    }),
    { name: 'lockulture-feed-interactions-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
