import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Era } from '@/domain/models';
import { colors } from '@/shared/theme/tokens';

const descriptions: Record<string, string> = {
  ERA_ANCIENT:
    'Lần theo những dấu ấn đầu tiên. Mỗi khám phá là một mảnh ghép đưa bạn gần hơn với câu chuyện dựng nước.',
  ERA_LY_TRAN:
    'Tìm lại dấu ấn một thời qua những địa danh, tên đường và câu chuyện vẫn hiện diện trong cuộc sống hôm nay.',
  ERA_NGUYEN:
    'Một mái ngói, một tên đường, một dấu xưa. Bắt đầu hành trình kết nối những mảnh ghép của triều Nguyễn.',
  ERA_MODERN:
    'Khám phá những nơi lưu giữ ký ức chuyển mình, từ dấu ấn kiến trúc đến câu chuyện ngay trên phố.',
};
export function EraDetail({ era }: { era: Era }) {
  const decoded = era.status === 'decoded';
  const label = decoded
    ? 'Đã giải mã'
    : era.status === 'in_progress'
      ? 'Đang khám phá'
      : 'Chưa giải mã';
  // Goals come from service data; the small preview is bounded for accessibility/layout.
  const visibleFragments = Math.max(0, Math.min(era.fragmentGoal, 6));
  return (
    <View style={styles.panel}>
      <View style={styles.topRow}>
        <View style={styles.eyebrow}>
          <View style={styles.statusDot} />
          <Text style={styles.status}>{label}</Text>
        </View>
        <View style={styles.reward}>
          <Ionicons name="sparkles-outline" color={colors.yellow} size={12} />
          <Text style={styles.rewardText}>+100 XP</Text>
        </View>
      </View>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text accessibilityRole="header" style={styles.title}>
            {era.name}
          </Text>
        </View>
        <View style={styles.emblem} accessible={false}>
          <Ionicons name="compass-outline" size={48} color={colors.accent} />
        </View>
      </View>
      <Text style={styles.description}>
        {descriptions[era.id] ??
          'Khám phá những câu chuyện quanh bạn và thu thập mảnh ghép của thời kỳ này.'}
      </Text>
      <View style={styles.fragmentRow}>
        <View
          style={styles.fragments}
          accessibilityLabel={`${era.fragmentCount} trên ${era.fragmentGoal} mảnh ghép`}
        >
          {Array.from({ length: visibleFragments }, (_, index) => (
            <View
              key={index}
              style={[styles.fragment, index < era.fragmentCount && styles.fragmentFilled]}
            >
              <Ionicons
                name={index < era.fragmentCount ? 'checkmark' : 'add'}
                size={15}
                color={index < era.fragmentCount ? colors.accent : colors.subtle}
              />
            </View>
          ))}
        </View>
        <Text style={styles.fragmentCount}>
          {era.fragmentCount}
          <Text style={styles.fragmentTotal}> / {era.fragmentGoal} mảnh ghép</Text>
        </Text>
      </View>
      <Text style={styles.goal}>
        {decoded
          ? 'Câu chuyện đã mở. Bạn vẫn có thể khám phá tiếp.'
          : `Thu thập ${Math.max(0, era.fragmentGoal - era.fragmentCount)} mảnh ghép nữa để mở câu chuyện.`}
      </Text>
      <Link href={{ pathname: '/(main)/missions/search', params: { eraId: era.id } }} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tìm nhiệm vụ thời kỳ này"
          style={styles.cta}
        >
          <Ionicons name="navigate-outline" size={18} color={colors.background} />
          <Text style={styles.ctaText}>Tìm nhiệm vụ thời kỳ này</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.background} />
        </Pressable>
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 22,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  eyebrow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent },
  status: { fontSize: 14, letterSpacing: 0, fontWeight: '700', color: colors.muted },
  reward: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.rewardSurface,
  },
  rewardText: { color: colors.yellow, fontSize: 14, fontWeight: '600' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titleBlock: { flex: 1 },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: -0.6,
  },
  emblem: { opacity: 0.5, transform: [{ rotate: '-20deg' }] },
  description: { color: colors.muted, fontSize: 16, lineHeight: 25 },
  fragmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  fragments: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fragment: {
    height: 32,
    width: 32,
    borderRadius: 9,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fragmentFilled: {
    borderStyle: 'solid',
    borderColor: colors.accent,
    backgroundColor: colors.accentSurface,
  },
  fragmentCount: { color: colors.text, fontSize: 14, fontWeight: '600' },
  fragmentTotal: { color: colors.muted, fontWeight: '400' },
  goal: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    minHeight: 52,
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: colors.accent,
  },
  ctaText: {
    flexShrink: 1,
    color: colors.background,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  pressed: { opacity: 0.75 },
});
