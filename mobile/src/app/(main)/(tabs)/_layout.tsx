import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/shared/components/bottom-navigation';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state }) => <BottomNavigation active={state.routes[state.index]?.name} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Khám phá' }} />
      <Tabs.Screen name="capture" options={{ title: 'Máy ảnh' }} />
      <Tabs.Screen name="feed" options={{ title: 'Bảng tin' }} />
    </Tabs>
  );
}
