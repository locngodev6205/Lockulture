import { useLocalSearchParams, router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Note, Surface, commonStyles as c } from '@/shared/components/surface';
import { useCaptureStore } from '@/state/capture-store';
import { useAppStore } from '@/state/app-store';
import { colors } from '@/shared/theme/tokens';
import { env } from '@/config/env';
export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAppStore((s) => s.mockUser);
  const record = useCaptureStore((s) =>
    s.records.find((r) => r.id === id && r.ownerId === user?.id),
  );
  if (!record)
    return (
      <Page title="Kết quả">
        <Note>Không tìm thấy kết quả này.</Note>
        <Action label="Về Khám phá" href="/(main)/(tabs)" />
      </Page>
    );
  const success = record.verdict === 'accepted' || record.verdict === 'completed';
  const titles = {
    accepted: 'Khám phá đã lưu',
    completed: 'Nhiệm vụ hoàn thành',
    retake_required: 'Chụp rõ hơn một chút',
    unidentified: 'Cần thêm một góc nhìn',
    out_of_scope: 'Thử một đối tượng khác',
    not_matched: 'Chưa khớp nhiệm vụ',
  };
  function retry() {
    if (!record) return;
    useCaptureStore.getState().retake(record);
    router.replace({
      pathname: '/(main)/capture/camera',
      params: { mode: record.mode, ...(record.missionId ? { missionId: record.missionId } : {}) },
    });
  }
  return (
    <Page title={titles[record.verdict]}>
      <Image
        source={{ uri: record.photo.uri }}
        accessibilityLabel="Ảnh khám phá"
        style={{ width: '100%', aspectRatio: 1, borderRadius: 20 }}
      />
      {success ? (
        <>
          <Surface>
            <View style={c.row}>
              <Ionicons name="checkmark-circle-outline" size={28} color={colors.accent} />
              <Text style={{ color: colors.accent, fontSize: 18 }}>Đã nhận {record.xp} XP</Text>
            </View>
            <Text style={c.title}>{record.name}</Text>
            <Text style={c.body}>{record.knowledge}</Text>
            <Note>
              {record.fragmentAdded
                ? 'Đã thêm một mảnh ghép vào dòng thời gian.'
                : 'Không có mảnh mới cho đối tượng này.'}
            </Note>
          </Surface>
          {env.dataSource === 'mock' && (
            <Note>
              Kết quả mẫu. Kiến thức và điểm thưởng ở đây phục vụ thử nghiệm luồng, không phải đánh
              giá thật của Gemini.
            </Note>
          )}
          <Action
            label="Chia sẻ khám phá"
            href={{ pathname: '/(main)/posts/compose', params: { discoveryId: record.id } }}
          />
          <Action secondary label="Xem bộ sưu tập" href="/(main)/collection" />
          <Action
            secondary
            label={record.mode === 'mission' ? 'Tìm nhiệm vụ mới' : 'Chụp tiếp'}
            href={
              record.mode === 'mission'
                ? '/(main)/missions/search'
                : { pathname: '/(main)/capture/camera', params: { mode: 'free' } }
            }
          />
        </>
      ) : (
        <>
          <Note>{record.instruction}</Note>
          <Action label="Chụp lại" onPress={retry} />
          {record.mode === 'mission' && record.missionId && (
            <Action
              secondary
              label="Xem nhiệm vụ"
              href={{ pathname: '/(main)/missions/[id]', params: { id: record.missionId } }}
            />
          )}
        </>
      )}
      <Action secondary label="Về Khám phá" href="/(main)/(tabs)" />
    </Page>
  );
}
