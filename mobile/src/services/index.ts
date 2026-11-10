import { mockCaptureService } from '@/services/mock/capture-service';
import { mockMissionService } from '@/services/mock/mission-service';
import { env } from '@/config/env';
import type {
  ExplorationService,
  FeedService,
  MissionService,
  CaptureService,
} from '@/services/contracts';
import { mockExplorationService, mockFeedService } from '@/services/mock';

async function notIntegrated(): Promise<never> {
  throw new Error('API mới chưa được tích hợp. Dùng EXPO_PUBLIC_DATA_SOURCE=mock để dựng UI.');
}
const apiExplorationService: ExplorationService = { listEras: notIntegrated };
const apiFeedService: FeedService = { listPosts: notIntegrated };
// Never silently fall back to fixtures when a real API fails.
const apiMissionService: MissionService = { search: notIntegrated };
const apiCaptureService: CaptureService = { evaluate: notIntegrated };
export const services = {
  capture: env.dataSource === 'mock' ? mockCaptureService : apiCaptureService,
  missions: env.dataSource === 'mock' ? mockMissionService : apiMissionService,
  exploration: env.dataSource === 'mock' ? mockExplorationService : apiExplorationService,
  feed: env.dataSource === 'mock' ? mockFeedService : apiFeedService,
};
