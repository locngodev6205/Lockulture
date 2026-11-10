import { ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/state/app-store';
import { Surface, Note, commonStyles as c } from '@/shared/components/surface';
import { Action } from '@/shared/components/action';
import { colors } from '@/shared/theme/tokens';
export default function CaptureChoiceScreen() {
  const mission = useAppStore((s) => s.activeMission);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={{ padding: 22, gap: 22, paddingBottom: 36 }}>
        <Text
          accessibilityRole="header"
          style={{ color: colors.text, fontSize: 30, fontWeight: '600' }}
        >
          Máy ảnh
        </Text>
        <Text style={c.body}>Một bức ảnh, một câu chuyện để khám phá.</Text>
        <Surface>
          <View style={c.row}>
            <Ionicons name="camera-outline" size={28} color={colors.accent} />
            <Text style={{ color: colors.accent, fontSize: 14 }}>Thưởng 20 XP</Text>
          </View>
          <Text style={c.title}>Khám phá tự do</Text>
          <Text style={c.body}>
            Chụp biển tên đường, món ăn hoặc đồ vật có dấu ấn văn hóa. Không cần nhận nhiệm vụ
            trước.
          </Text>
          <Action
            label="Chụp khám phá"
            href={{ pathname: '/(main)/capture/camera', params: { mode: 'free' } }}
          />
        </Surface>
        <Surface>
          <Text style={c.title}>{mission ? 'Nhiệm vụ đang khám phá' : 'Khám phá có mục tiêu'}</Text>
          <Text style={c.body}>
            {mission
              ? `${mission.eraName}. Chụp theo yêu cầu để hoàn thành nhiệm vụ.`
              : 'Nhận mật thư và tìm một địa điểm để nhận thêm XP.'}
          </Text>
          {mission ? (
            <>
              <Action
                label="Chụp cho nhiệm vụ"
                href={{
                  pathname: '/(main)/capture/camera',
                  params: { mode: 'mission', missionId: mission.id },
                }}
              />
              <Action
                secondary
                label="Xem nhiệm vụ"
                href={{ pathname: '/(main)/missions/[id]', params: { id: mission.id } }}
              />
            </>
          ) : (
            <Action
              textColor="#000000"
              label="Tìm nhiệm vụ quanh đây"
              href="/(main)/missions/search"
            />
          )}
        </Surface>
        <Note>Chỉ xin quyền camera khi bạn mở màn hình chụp.</Note>
      </ScrollView>
    </SafeAreaView>
  );
}
