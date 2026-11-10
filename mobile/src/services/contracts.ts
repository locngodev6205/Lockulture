import type { Era, FeedPost } from '@/domain/models';

// UI-facing contracts. Map transport DTOs here when the proposed API is implemented.
export interface ExplorationService {
  listEras(): Promise<Era[]>;
}
export interface FeedService {
  listPosts(): Promise<FeedPost[]>;
}

export interface MissionService {
  search(
    input: import('@/domain/models').MissionSearchInput,
    signal: AbortSignal,
    onStage: (stage: import('@/domain/models').MissionSearchStage) => void,
  ): Promise<import('@/domain/models').MissionSearchResult>;
}

export interface CaptureService {
  evaluate(
    draft: import('@/domain/models').CaptureDraft,
    signal: AbortSignal,
  ): Promise<import('@/domain/models').CaptureAssessment>;
}
