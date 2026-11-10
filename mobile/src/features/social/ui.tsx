import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/shared/theme/tokens';
import { Action } from '@/shared/components/action';
import { Surface, commonStyles as c } from '@/shared/components/surface';
export const socialStyles = StyleSheet.create({
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
export function SearchInput({
  value,
  onChangeText,
  label,
  maxLength = 80,
}: {
  value: string;
  onChangeText: (v: string) => void;
  label: string;
  maxLength?: number;
}) {
  return (
    <TextInput
      accessibilityLabel={label}
      placeholder={label}
      placeholderTextColor={colors.subtle}
      value={value}
      onChangeText={onChangeText}
      maxLength={maxLength}
      style={socialStyles.input}
      autoCapitalize="none"
    />
  );
}
export function Person({
  name,
  detail,
  onPress,
}: {
  name: string;
  detail?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={name}
      disabled={!onPress}
      onPress={onPress}
      style={socialStyles.row}
    >
      <View style={socialStyles.avatar}>
        <Text style={{ color: colors.accent, fontSize: 20, fontWeight: '600' }}>
          {name
            .split(' ')
            .map((n) => n[0])
            .slice(-2)
            .join('')}
        </Text>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={c.title}>{name}</Text>
        {detail && <Text style={c.label}>{detail}</Text>}
      </View>
    </Pressable>
  );
}
export function SelectRow({
  name,
  selected,
  onPress,
}: {
  name: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={name}
      onPress={onPress}
      style={[
        socialStyles.input,
        socialStyles.row,
        { justifyContent: 'space-between', borderColor: selected ? colors.accent : colors.border },
      ]}
    >
      <Text style={c.body}>{name}</Text>
      <Text style={{ color: colors.accent, fontSize: 22 }}>{selected ? '✓' : '+'}</Text>
    </Pressable>
  );
}
export function Confirm({
  children,
  onConfirm,
  onCancel,
  label,
}: PropsWithChildren<{ onConfirm: () => void; onCancel: () => void; label: string }>) {
  return (
    <Surface>
      <Text style={c.body}>{children}</Text>
      <Action label={label} onPress={onConfirm} />
      <Action secondary label="Hủy" onPress={onCancel} />
    </Surface>
  );
}
export function DemoNote() {
  return (
    <Text style={c.label}>
      Dữ liệu demo lưu trên thiết bị. Lời mời và thay đổi nhóm chưa được gửi đến người khác.
    </Text>
  );
}
