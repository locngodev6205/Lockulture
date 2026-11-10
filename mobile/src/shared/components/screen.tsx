import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/shared/theme/tokens';

type Props = PropsWithChildren<{ title: string; description?: string }>;
export function Screen({ title, description, children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>LOCKULTURE</Text>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
        <View style={styles.children}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 48, gap: spacing.md },
  brand: { color: colors.accent, letterSpacing: 3, fontSize: 14, fontWeight: '700' },
  title: { color: colors.text, fontSize: 30, fontWeight: '700' },
  description: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  children: { gap: spacing.md },
});
