import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action } from '@/shared/components/action';
import { colors } from '@/shared/theme/tokens';
export function ConfirmSheet({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng xác nhận"
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <Text accessibilityRole="header" style={styles.title}>
            Đổi nhiệm vụ?
          </Text>
          <Text style={styles.body}>
            Nhiệm vụ hiện tại chỉ được thay khi đã tìm được mục tiêu mới. Nếu chưa tìm được, bạn vẫn
            có thể tiếp tục nhiệm vụ này.
          </Text>
          <Action label="Tìm nhiệm vụ khác" onPress={onConfirm} />
          <Action secondary label="Giữ nhiệm vụ" onPress={onCancel} />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#00000099', justifyContent: 'flex-end' },
  sheet: {
    padding: 24,
    gap: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: { color: colors.text, fontSize: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 25, color: colors.muted },
});
