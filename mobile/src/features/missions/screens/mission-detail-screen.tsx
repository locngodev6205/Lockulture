import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Surface, Note, commonStyles as c } from '@/shared/components/surface';
import { ConfirmSheet } from '@/shared/components/confirm-sheet';
import { colors } from '@/shared/theme/tokens';
import { useAppStore } from '@/state/app-store';
export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mission = useAppStore((s) => s.activeMission);
  const revealHint = useAppStore((s) => s.revealHint);
  const revealAnswer = useAppStore((s) => s.revealAnswer);
  const [confirm, setConfirm] = useState(false);
  const [mapError, setMapError] = useState(false);
  if (!mission || mission.id !== id)
    return (
      <Page title="Nhiệm vụ">
        <Note>
          Nhiệm vụ này không còn hoạt động. Hãy mở nhiệm vụ hiện tại hoặc tìm một mục tiêu mới.
        </Note>
        {mission && (
          <Action
            label="Mở nhiệm vụ hiện tại"
            href={{ pathname: '/(main)/missions/[id]', params: { id: mission.id } }}
          />
        )}
        <Action secondary label="Về Khám phá" href="/(main)/(tabs)" />
      </Page>
    );
  const m = mission;
  async function openMap() {
    setMapError(false);
    try {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.location.latitude},${m.location.longitude}`)}`,
      );
    } catch {
      setMapError(true);
    }
  }
  return (
    <Page title="Nhiệm vụ của bạn" subtitle={m.eraName}>
      <View style={c.row}>
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={18} color={colors.accent} />
          <Text style={c.body}>
            {m.distanceMeters < 1000
              ? `${m.distanceMeters} m`
              : `${(m.distanceMeters / 1000).toFixed(1)} km`}{' '}
            quanh vị trí tìm
          </Text>
        </View>
        <Text style={styles.reward}>Thưởng {m.xp} XP</Text>
      </View>
      <Surface>
        <Text style={styles.clueTitle}>Mật thư</Text>
        <Text style={styles.clue}>{m.clue}</Text>
        <Note>Tìm địa điểm và chụp bằng chứng để góp một mảnh ghép cho thời kỳ này.</Note>
      </Surface>
      <View style={styles.section}>
        <Text style={c.title}>Bạn cần chụp gì?</Text>
        {m.photoRequirements.map((line) => (
          <View style={styles.requirement} key={line}>
            <Ionicons name="camera-outline" size={18} color={colors.accent} />
            <Text style={[c.body, styles.flex]}>{line}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        {m.hints.slice(0, m.revealedHints).map((hint, i) => (
          <Surface key={hint}>
            <Text style={c.title}>Gợi ý {i + 1}</Text>
            <Text style={c.body}>{hint}</Text>
          </Surface>
        ))}
        <Action
          secondary
          disabled={m.revealedHints >= m.hints.length}
          label={
            m.revealedHints >= m.hints.length
              ? 'Đã mở hết gợi ý'
              : `Gợi ý thêm (${m.revealedHints}/${m.hints.length})`
          }
          onPress={() => revealHint(m.id)}
        />
      </View>
      {!m.answerRevealed ? (
        <Action secondary label="Xem đáp án và đường đi" onPress={() => revealAnswer(m.id)} />
      ) : (
        <Surface>
          <Text style={c.title}>{m.placeName}</Text>
          <Text style={c.body}>{m.address}</Text>
          <Action secondary label="Mở Google Maps" onPress={() => void openMap()} />
          {mapError && (
            <Note error>
              Chưa mở được bản đồ. Bạn có thể tìm địa chỉ trên bằng ứng dụng bản đồ.
            </Note>
          )}
        </Surface>
      )}
      <Action
        label="Chụp hoàn thành"
        href={{ pathname: '/(main)/capture/camera', params: { mode: 'mission', missionId: m.id } }}
      />
      <Action secondary label="Đổi nhiệm vụ" onPress={() => setConfirm(true)} />
      <ConfirmSheet
        visible={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          router.push({
            pathname: '/(main)/missions/search',
            params: { eraId: m.eraId, replaceId: m.id },
          });
        }}
      />
    </Page>
  );
}
const styles = StyleSheet.create({
  section: { gap: 14 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  reward: { color: colors.accent, fontSize: 14, lineHeight: 22 },
  clueTitle: {
    color: colors.accent,
    fontSize: 24,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia' }),
  },
  clue: { color: colors.text, fontSize: 19, lineHeight: 31 },
  requirement: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  flex: { flex: 1 },
});
