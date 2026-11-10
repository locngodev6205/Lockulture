import { BottomNavigation } from '@/shared/components/bottom-navigation';
import type { PropsWithChildren } from 'react';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/shared/theme/tokens';
export function Page({
  title,
  subtitle,
  children,
  tabs = false,
}: PropsWithChildren<{ title: string; subtitle?: string; tabs?: boolean }>) {
  return (
    <SafeAreaView
      style={styles.safe}
      edges={tabs ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            style={styles.back}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          >
            <Ionicons name="arrow-back" size={23} color={colors.text} />
          </Pressable>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <View style={styles.body}>{children}</View>
      </ScrollView>
      {tabs && <BottomNavigation />}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 22, gap: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { minHeight: 44, minWidth: 44, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '600', color: colors.text, flex: 1 },
  subtitle: { fontSize: 16, lineHeight: 25, color: colors.muted },
  body: { gap: 20 },
});
