import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/theme/tokens';
export function BottomNavigation({ active = 'feed' }: { active?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 10,
      }}
    >
      {(
        [
          { key: 'index', label: 'Khám phá', icon: 'compass-outline', href: '/(main)/(tabs)' },
          {
            key: 'capture',
            label: 'Máy ảnh',
            icon: 'camera-outline',
            href: '/(main)/(tabs)/capture',
          },
          { key: 'feed', label: 'Bảng tin', icon: 'images-outline', href: '/(main)/(tabs)/feed' },
        ] as const
      ).map((tab) => (
        <Pressable
          key={tab.key}
          accessibilityRole="tab"
          accessibilityLabel={tab.label}
          accessibilityState={{ selected: active === tab.key }}
          onPress={() => router.navigate(tab.href)}
          style={{ flex: 1, minHeight: 55, alignItems: 'center', justifyContent: 'center', gap: 4 }}
        >
          <Ionicons
            name={tab.icon}
            size={27}
            color={active === tab.key ? colors.accent : colors.muted}
          />
          <Text
            style={{
              color: active === tab.key ? colors.accent : colors.muted,
              fontSize: 14,
              fontWeight: '600',
            }}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
