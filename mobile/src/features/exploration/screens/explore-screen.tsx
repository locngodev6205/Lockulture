import { useCaptureStore } from '@/state/capture-store';
import type { Era } from '@/domain/models';
import { Action } from '@/shared/components/action';
import { Surface, commonStyles as common } from '@/shared/components/surface';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/shared/theme/tokens';
import { services } from '@/services';
import { useAppStore } from '@/state/app-store';
import { EraTimeline } from '@/features/exploration/components/era-timeline';
import { EraDetail } from '@/features/exploration/components/era-detail';

export default function ExploreScreen() {
  const activeMission = useAppStore((s) => s.activeMission);
  const selected = useAppStore((s) => s.selectedEraId);
  const selectEra = useAppStore((s) => s.selectEra);
  const user = useAppStore((s) => s.mockUser);
  const {
    data: baseEras,
    isPending,
    error,
    refetch,
  } = useQuery({ queryKey: ['timeline'], queryFn: services.exploration.listEras });
  const records = useCaptureStore((s) => s.records);
  const eras = baseEras?.map((era): Era => {
    const count = Math.min(
      era.fragmentGoal,
      records.filter((r) => r.ownerId === user?.id && r.fragmentAdded && r.eraId === era.id).length,
    );
    return {
      ...era,
      fragmentCount: count,
      status: count >= era.fragmentGoal ? 'decoded' : count ? 'in_progress' : 'not_started',
    };
  });
  const era = eras?.find((item) => item.id === selected) ?? eras?.[0];
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="scan-outline" size={19} color={colors.accent} />
            </View>
            <Text style={styles.wordmark}>
              lockulture<Text style={styles.brandDot}>.</Text>
            </Text>
          </View>
          <Link href="/(main)/profile" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mở hồ sơ"
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || 'L'}
              </Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.headerDivider} />
        {activeMission && (
          <View style={{ marginBottom: 22 }}>
            <Surface>
              <Text style={common.title}>Nhiệm vụ đang khám phá</Text>
              <Text style={common.body}>{activeMission.eraName}</Text>
              <Action
                label="Tiếp tục nhiệm vụ"
                href={{ pathname: '/(main)/missions/[id]', params: { id: activeMission.id } }}
              />
            </Surface>
          </View>
        )}
        <View style={styles.sectionHeader}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Dòng thời gian
          </Text>
          <View style={styles.swipeHint}>
            <Text style={styles.small}>Lướt để khám phá</Text>
            <Ionicons name="arrow-forward" size={13} color={colors.subtle} />
          </View>
        </View>
        {isPending ? (
          <View style={styles.feedback}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.small}>Đang mở dòng thời gian…</Text>
          </View>
        ) : null}
        {error ? (
          <View style={styles.feedback}>
            <Text style={styles.error}>{error.message}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void refetch();
              }}
              style={styles.retry}
            >
              <Text style={styles.linkText}>Thử lại</Text>
            </Pressable>
          </View>
        ) : null}
        {!isPending && !error && !eras?.length ? (
          <View style={styles.feedback}>
            <Ionicons name="time-outline" size={28} color={colors.muted} />
            <Text style={styles.intro}>Chưa có thời kỳ để khám phá.</Text>
          </View>
        ) : null}
        {!error && eras?.length && era ? (
          <>
            <EraTimeline eras={eras} selectedId={era.id} onSelect={selectEra} />
            <EraDetail era={era} />
          </>
        ) : null}
        <Link href="/(main)/missions/search" asChild>
          <Pressable accessibilityRole="button" style={styles.nearby}>
            <Ionicons name="location-outline" size={17} color={colors.accent} />
            <Text style={styles.nearbyText}>Hoặc tìm nhiệm vụ quanh đây</Text>
            <Ionicons name="arrow-up-right-box-outline" size={16} color={colors.muted} />
          </Pressable>
        </Link>
        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Theo cách của bạn
          </Text>
          <Text style={styles.small}>Không cần nhiệm vụ</Text>
        </View>
        <Link href={{ pathname: '/(main)/capture/camera', params: { mode: 'free' } }} asChild>
          <Pressable accessibilityRole="button" style={styles.freeCard}>
            <View style={styles.cameraIcon}>
              <Ionicons name="camera-outline" size={23} color={colors.accent} />
            </View>
            <View style={styles.freeCopy}>
              <Text style={styles.freeTitle}>Bắt gặp một điều thú vị?</Text>
              <Text style={styles.freeDescription}>
                Chụp tên đường, món ăn hoặc đồ vật.{'\n'}Để câu chuyện tự tìm đến bạn.
              </Text>
              <Text style={styles.freeAction}>
                Chụp khám phá <Ionicons name="arrow-forward" size={12} />
              </Text>
            </View>
          </Pressable>
        </Link>
        <Link href="/(main)/collection" asChild>
          <Pressable accessibilityRole="button" style={styles.collection}>
            <View style={styles.collectionCopy}>
              <Ionicons name="albums-outline" size={18} color={colors.muted} />
              <Text style={styles.collectionText}>Bộ sưu tập của bạn</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',

    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 32,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: {
    height: 32,
    width: 32,
    borderRadius: 10,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { color: colors.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.8 },
  brandDot: { color: colors.accent },
  avatar: {
    minHeight: 44,
    minWidth: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  avatarText: { color: colors.muted, fontSize: 16, fontWeight: '500' },
  eyebrow: { color: colors.muted, fontSize: 14, letterSpacing: 2.1, fontWeight: '600' },
  intro: { color: colors.muted, fontSize: 16, lineHeight: 25 },
  headerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 18,
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '600', letterSpacing: -0.3 },
  swipeHint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  small: { color: colors.subtle, fontSize: 14, lineHeight: 22 },
  feedback: {
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
  },
  error: { color: colors.danger, lineHeight: 25 },
  retry: { padding: 12 },
  linkText: { color: colors.accent },
  nearby: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  nearbyText: { color: colors.muted, fontSize: 14, flexShrink: 1 },
  pressed: { opacity: 0.65 },
  divider: { height: 1, backgroundColor: colors.border, marginTop: 14, marginBottom: 28 },
  freeCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: colors.surface,
  },
  cameraIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  freeCopy: { flex: 1, gap: 9 },
  freeTitle: { color: colors.text, fontSize: 16, fontWeight: '600', lineHeight: 25 },
  freeDescription: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  freeAction: { color: colors.accent, fontSize: 14, fontWeight: '600', marginTop: 3 },
  collection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  collectionCopy: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  collectionText: { color: colors.muted, fontSize: 14 },
  footer: {
    color: colors.subtle,
    textAlign: 'center',
    fontSize: 14,
    paddingTop: 20,
    letterSpacing: 0.5,
  },
});
