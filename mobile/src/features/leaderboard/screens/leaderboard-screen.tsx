import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Page } from '@/shared/components/page';
import { Note, commonStyles as c } from '@/shared/components/surface';
import { Action } from '@/shared/components/action';
import { colors } from '@/shared/theme/tokens';
import { useAppStore } from '@/state/app-store';
import { useCaptureStore } from '@/state/capture-store';
import { people, useSocialStore } from '@/state/social-store';
export default function LeaderboardScreen() {
  const user = useAppStore((s) => s.mockUser);
  const records = useCaptureStore((s) => s.records);
  const relations = useSocialStore((s) => s.relations);
  const xp = records.filter((r) => r.ownerId === user?.id).reduce((sum, r) => sum + r.xp, 0);
  const friends = people.filter((p) => relations[p.id] === 'friend');
  const rows = [
    ...friends.map((p) => ({ id: p.id, name: p.name, xp: p.xp })),
    { id: user?.id ?? 'mock-user', name: user?.displayName ?? 'Bạn', xp },
  ].sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name, 'vi'));
  const rank = (score: number) => 1 + rows.filter((p) => p.xp > score).length;
  return (
    <Page tabs title="Bảng xếp hạng">
      <View style={styles.summary}>
        <Ionicons name="trophy-outline" size={32} color={colors.accent} />
        <View style={{ gap: 4 }}>
          <Text style={c.title}>Bạn đang ở hạng {rank(xp)}</Text>
          <Text style={c.body}>{xp} XP · Tổng tích lũy</Text>
        </View>
      </View>
      <Note>Bạn và {friends.length} người bạn · Cùng XP được xếp cùng hạng.</Note>
      {rows.map((p) => {
        const me = p.id === user?.id;
        return (
          <Pressable
            key={p.id}
            accessibilityRole="button"
            accessibilityLabel={`Hạng ${rank(p.xp)}, ${p.name}${me ? ', bạn' : ''}, ${p.xp} XP`}
            onPress={() =>
              router.push(
                me ? '/(main)/profile' : { pathname: '/(main)/friends/[id]', params: { id: p.id } },
              )
            }
            style={[styles.row, me && styles.self]}
          >
            <Text style={[c.title, { color: colors.accent, width: 36 }]}>#{rank(p.xp)}</Text>
            <Text style={[c.title, { flex: 1 }]}>
              {p.name}
              {me ? ' (bạn)' : ''}
            </Text>
            <Text style={{ color: colors.accent, fontSize: 18, fontWeight: '600' }}>{p.xp} XP</Text>
          </Pressable>
        );
      })}
      {!friends.length && (
        <>
          <Note>Kết bạn để so sánh hành trình khám phá của bạn.</Note>
          <Action label="Tìm bạn" href="/(main)/friends" />
        </>
      )}
      <Note>
        XP của bạn lấy từ khám phá trên thiết bị. XP bạn bè là dữ liệu demo, chưa đồng bộ từ máy
        chủ.
      </Note>
    </Page>
  );
}
const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    minHeight: 76,
  },
  self: { borderColor: colors.accent },
});
