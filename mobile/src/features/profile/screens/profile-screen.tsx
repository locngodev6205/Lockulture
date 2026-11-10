import { Text } from 'react-native';
import { useCaptureStore } from '@/state/capture-store';
import { colors } from '@/shared/theme/tokens';
import { useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/shared/components/screen';
import { Action } from '@/shared/components/action';
import { useAppStore } from '@/state/app-store';
export default function ProfileScreen() {
  const user = useAppStore((s) => s.mockUser);
  const xp = useCaptureStore((s) => s.records)
    .filter((r) => r.ownerId === user?.id)
    .reduce((sum, r) => sum + r.xp, 0);
  const signOut = useAppStore((s) => s.signOut);
  const client = useQueryClient();
  return (
    <Screen
      title={user?.displayName ?? 'Hồ sơ'}
      description="Phiên xem trước bằng dữ liệu mock; chưa có xác thực thật."
    >
      <Text style={{ color: colors.accent, fontSize: 20 }}>Tổng XP: {xp}</Text>
      <Action label="Bộ sưu tập" href="/(main)/collection" />
      <Action secondary label="Bạn bè" href="/(main)/friends" />
      <Action secondary label="Nhóm" href="/(main)/groups" />
      <Action
        secondary
        label="Kết thúc phiên mock"
        onPress={() => {
          client.clear();
          signOut();
        }}
      />
    </Screen>
  );
}
