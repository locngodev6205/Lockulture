import type { MissionService } from '@/services/contracts';
import { missionFixtures } from '@/mocks/missions';
import type { Coordinates } from '@/domain/models';
function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('Đã dừng tìm kiếm'));
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(new Error('Đã dừng tìm kiếm'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, ms);
    signal.addEventListener('abort', abort, { once: true });
  });
}
function distance(a: Coordinates, b: Coordinates) {
  const rad = (n: number) => (n * Math.PI) / 180;
  const dlat = rad(b.latitude - a.latitude),
    dlon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dlon / 2) ** 2;
  return Math.round(6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, h))));
}
export const mockMissionService: MissionService = {
  async search(input, signal, onStage) {
    onStage('finding');
    await wait(600, signal);
    if (input.scenario === 'error')
      throw new Error('Chưa thể tìm nhiệm vụ. Thử lại hoặc giữ nhiệm vụ hiện tại.');
    onStage('reviewing');
    await wait(600, signal);
    const candidates = missionFixtures
      .map((m) => ({ ...m, distanceMeters: distance(input.location, m.location) }))
      .filter(
        (m) =>
          (!input.eraId || m.eraId === input.eraId) &&
          m.placeId !== input.excludePlaceId &&
          m.distanceMeters <= input.radiusMeters,
      )
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
    if (input.scenario === 'empty' || !candidates.length) return { status: 'no_suitable_place' };
    onStage('preparing');
    await wait(600, signal);
    return {
      status: 'ready',
      mission: {
        ...candidates[0],
        id: `mission-${Date.now()}`,
        version: 1,
        revealedHints: 0,
        answerRevealed: false,
      },
    };
  },
};
