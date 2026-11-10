import { router, type Href } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/shared/theme/tokens';
type Props = {
  label: string;
  textColor?: string;
  href?: Href;
  onPress?: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
};
export function Action({ label, href, onPress, secondary, disabled, loading, textColor }: Props) {
  const blocked = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!blocked, busy: !!loading }}
      disabled={blocked}
      onPress={() => {
        if (href) router.push(href);
        else onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (pressed || blocked) && styles.dim,
      ]}
    >
      {loading && <ActivityIndicator color={secondary ? colors.accent : colors.background} />}
      <Text
        style={[
          styles.label,
          secondary && styles.secondaryLabel,
          textColor ? { color: textColor } : undefined,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dim: { opacity: 0.55 },
  label: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
    textAlign: 'center',
  },
  secondaryLabel: { color: colors.text },
});
