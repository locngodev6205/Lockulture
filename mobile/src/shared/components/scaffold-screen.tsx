import { router } from 'expo-router';
import { Text } from 'react-native';
import { Action } from '@/shared/components/action';
import { Screen } from '@/shared/components/screen';
import { colors } from '@/shared/theme/tokens';

type Props = { title: string; description: string };
export function ScaffoldScreen({ title, description }: Props) {
  return (
    <Screen title={title} description={description}>
      <Text style={{ color: colors.accent }}>Màn hình khung · chưa triển khai nghiệp vụ</Text>
      <Action
        secondary
        label="Quay lại"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
    </Screen>
  );
}
