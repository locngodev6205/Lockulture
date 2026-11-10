import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/tokens';
export function Surface({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}
export function Note({ children, error = false }: PropsWithChildren<{ error?: boolean }>) {
  return (
    <Text
      accessibilityRole={error ? 'alert' : undefined}
      style={[styles.note, error && styles.error]}
    >
      {children}
    </Text>
  );
}
export const commonStyles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '600', lineHeight: 26, color: colors.text },
  body: { fontSize: 16, lineHeight: 25, color: colors.muted },
  label: { fontSize: 14, lineHeight: 22, color: colors.subtle },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
});
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  note: { fontSize: 14, lineHeight: 22, color: colors.muted },
  error: { color: colors.danger },
});
