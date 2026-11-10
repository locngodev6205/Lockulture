import { Redirect } from 'expo-router';
import { useAppStore } from '@/state/app-store';
export default function Index() {
  const user = useAppStore((s) => s.mockUser);
  return <Redirect href={user ? '/(main)/(tabs)' : '/(auth)/login'} />;
}
