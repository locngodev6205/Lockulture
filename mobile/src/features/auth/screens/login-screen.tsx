import { Action } from '@/shared/components/action';
import { Screen } from '@/shared/components/screen';
import { useAppStore } from '@/state/app-store';
import { env } from '@/config/env';

export default function LoginScreen() {
  const enter = useAppStore((s) => s.enterMockSession);
  return (
    <Screen
      title="Chào mừng lữ khách"
      description="Bộ khung frontend. Form đăng nhập/đăng ký và xác thực thật sẽ được xây tiếp."
    >
      {env.dataSource === 'mock' ? (
        <Action label="Vào bản xem trước bằng dữ liệu mock" onPress={enter} />
      ) : null}
      <Action secondary label="Đăng ký" href="/(auth)/register" />
      <Action secondary label="Quên mật khẩu" href="/(auth)/forgot-password" />
    </Screen>
  );
}
