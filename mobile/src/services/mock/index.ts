import { eraFixtures, postFixtures } from '@/mocks/fixtures';
import type { ExplorationService, FeedService } from '@/services/contracts';

export const mockExplorationService: ExplorationService = {
  async listEras() {
    return eraFixtures.map((era) => ({ ...era }));
  },
};
export const mockFeedService: FeedService = {
  async listPosts() {
    return postFixtures.map((post) => ({ ...post }));
  },
};
