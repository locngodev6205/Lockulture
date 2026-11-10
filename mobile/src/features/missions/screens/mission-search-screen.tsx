import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { LocationInput } from '@/features/missions/components/location-input';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Surface, Note, commonStyles as c } from '@/shared/components/surface';
import { colors } from '@/shared/theme/tokens';
import { eraFixtures } from '@/mocks/fixtures';
import { env } from '@/config/env';
import { services } from '@/services';
import { useAppStore } from '@/state/app-store';
import type { Coordinates, MissionSearchInput, MissionSearchStage } from '@/domain/models';

const stages: Record<MissionSearchStage, string> = {
  finding: 'Đang tìm mục tiêu quanh bạn…',
  reviewing: 'Đang chọn địa điểm phù hợp…',
  preparing: 'Đang chuẩn bị mật thư và gợi ý…',
};
export default function MissionSearchScreen() {
  const params = useLocalSearchParams<{ eraId?: string; replaceId?: string }>();
  const eraId = typeof params.eraId === 'string' ? params.eraId : undefined;
  const era = eraFixtures.find((e) => e.id === eraId);
  const active = useAppStore((s) => s.activeMission);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState('Chưa áp dụng vị trí tìm kiếm');
  const [radius, setRadius] = useState(1000);
  const [stage, setStage] = useState<MissionSearchStage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);
  const locating = false;
  const [debug, setDebug] = useState(false);
  const [scenario, setScenario] = useState<MissionSearchInput['scenario']>('success');
  const request = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current?.abort();
    };
  }, []);
  const busy = !!stage || locating;
  const invalidEra = !!eraId && !era;
  const staleReplacement = !!params.replaceId && params.replaceId !== active?.id;
  async function find(nextRadius = radius) {
    if (request.current || !location || invalidEra || staleReplacement) return;
    const controller = new AbortController();
    request.current = controller;
    const expected = useAppStore.getState().activeMission?.id;
    setError(null);
    setEmpty(false);
    try {
      const result = await services.missions.search(
        {
          location,
          radiusMeters: nextRadius,
          eraId,
          excludePlaceId: params.replaceId ? active?.placeId : undefined,
          scenario,
        },
        controller.signal,
        setStage,
      );
      if (controller.signal.aborted || !mounted.current) return;
      if (result.status === 'no_suitable_place') {
        setEmpty(true);
        return;
      }
      if (useAppStore.getState().activeMission?.id !== expected)
        throw new Error('Nhiệm vụ đang hoạt động đã thay đổi. Hãy quay về và kiểm tra lại.');
      useAppStore.getState().setMission(result.mission);
      router.replace({ pathname: '/(main)/missions/[id]', params: { id: result.mission.id } });
    } catch (e) {
      if (!controller.signal.aborted && mounted.current)
        setError(e instanceof Error ? e.message : 'Chưa thể tìm nhiệm vụ. Hãy thử lại.');
    } finally {
      request.current = null;
      if (mounted.current) setStage(null);
    }
  }
  return (
    <Page title={params.replaceId ? 'Đổi nhiệm vụ' : 'Tìm nhiệm vụ'}>
      {invalidEra || staleReplacement ? (
        <>
          <Note error>
            {invalidEra
              ? 'Thời kỳ này không có trong danh sách hiện tại.'
              : 'Nhiệm vụ cần thay đã thay đổi hoặc không còn hoạt động.'}
          </Note>
          <Action label="Về Khám phá" href="/(main)/(tabs)" />
        </>
      ) : (
        <>
          <Surface>
            <View style={c.row}>
              <Text style={c.title}>{era?.name ?? 'Mọi thời kỳ'}</Text>
              <Text style={styles.reward}>Thưởng 100 XP</Text>
            </View>
            <Note>
              {era
                ? 'Giữ nguyên thời kỳ bạn đã chọn trong suốt lượt tìm.'
                : 'Địa điểm tìm được sẽ quyết định thời kỳ. Không giới hạn theo node trên trang chủ.'}
            </Note>
          </Surface>
          <View style={styles.section}>
            <Text style={c.title}>Vị trí tìm kiếm</Text>
            <View style={styles.location}>
              <Ionicons name="location-outline" size={22} color={colors.accent} />
              <Text style={[c.body, styles.flex]}>{locationName}</Text>
            </View>
            <LocationInput
              disabled={busy}
              onChange={(point, label) => {
                setLocation(point);
                setLocationName(label);
                setEmpty(false);
                setError(null);
              }}
            />
          </View>
          <View style={styles.section}>
            <Text style={c.title}>Phạm vi quanh bạn</Text>
            <View style={styles.options}>
              {[1000, 3000, 5000].map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={`Bán kính ${value / 1000} km`}
                  accessibilityState={{ selected: radius === value, disabled: busy }}
                  disabled={busy}
                  onPress={() => {
                    setRadius(value);
                    setEmpty(false);
                  }}
                  style={[styles.option, radius === value && styles.selected]}
                >
                  <Text style={[c.body, radius === value && styles.selectedText]}>
                    {value / 1000} km
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          {active && (
            <Note>Nhiệm vụ “{active.placeName}” vẫn được giữ cho đến khi có nhiệm vụ mới.</Note>
          )}
          {stage && (
            <Surface>
              <Text accessibilityLiveRegion="polite" style={c.title}>
                {stages[stage]}
              </Text>
              <Note>
                {env.dataSource === 'mock'
                  ? 'Đang chạy tình huống dữ liệu mẫu.'
                  : 'Bạn có thể quay lại để dừng lượt tìm.'}
              </Note>
            </Surface>
          )}
          {error && <Note error>{error}</Note>}
          {empty && (
            <Surface>
              <Text style={c.title}>Chưa có nhiệm vụ phù hợp</Text>
              <Note>
                Thử phạm vi rộng hơn hoặc tìm ở thời kỳ khác. Nhiệm vụ hiện tại của bạn không bị
                thay đổi.
              </Note>
              {radius < 5000 && (
                <Action
                  secondary
                  label="Tìm rộng hơn"
                  onPress={() => {
                    const next = radius === 1000 ? 3000 : 5000;
                    setRadius(next);
                    void find(next);
                  }}
                />
              )}
              {eraId && (
                <Action secondary label="Tìm ở mọi thời kỳ" href="/(main)/missions/search" />
              )}
            </Surface>
          )}
          <Action
            label={stage ? 'Đang tìm nhiệm vụ…' : error ? 'Thử tìm lại' : 'Tìm nhiệm vụ tại đây'}
            loading={!!stage}
            disabled={locating || !location}
            onPress={() => void find()}
          />
          {active && (
            <Action
              secondary
              disabled={busy}
              label="Tiếp tục nhiệm vụ hiện tại"
              href={{ pathname: '/(main)/missions/[id]', params: { id: active.id } }}
            />
          )}
          <Action
            secondary
            disabled={busy}
            label="Chụp khám phá tự do"
            href={{ pathname: '/(main)/capture/camera', params: { mode: 'free' } }}
          />
          {env.dataSource === 'mock' && (
            <Note>
              Dữ liệu mẫu quanh Huế, gồm Triều Nguyễn và Cận – hiện đại. Chưa gọi Maps/Gemini; các
              thời kỳ khác có thể chưa có mục tiêu.
            </Note>
          )}
          {__DEV__ && env.dataSource === 'mock' && (
            <View style={styles.section}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDebug(!debug)}
                style={styles.debug}
              >
                <Text style={c.label}>{debug ? 'Ẩn tình huống thử' : 'Tình huống thử'}</Text>
              </Pressable>
              {debug &&
                (['success', 'empty', 'error'] as const).map((value) => (
                  <Action
                    key={value}
                    secondary={scenario !== value}
                    disabled={busy}
                    label={
                      {
                        success: 'Tìm bình thường',
                        empty: 'Không có kết quả',
                        error: 'Lỗi dịch vụ',
                      }[value]
                    }
                    onPress={() => setScenario(value)}
                  />
                ))}
            </View>
          )}
        </>
      )}
    </Page>
  );
}
const styles = StyleSheet.create({
  section: { gap: 12 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flex: { flex: 1 },
  reward: { fontSize: 14, lineHeight: 22, color: colors.accent },
  options: { flexDirection: 'row', gap: 10 },
  option: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: { backgroundColor: colors.accent, borderColor: colors.accent },
  selectedText: { color: colors.background, fontWeight: '600' },
  debug: { minHeight: 44, justifyContent: 'center' },
});
