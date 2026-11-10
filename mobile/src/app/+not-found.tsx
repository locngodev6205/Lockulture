import { Action } from '@/shared/components/action';
import { Screen } from '@/shared/components/screen';
export default function NotFound() {
  return (
    <Screen title="Không tìm thấy trang">
      <Action label="Về trang chủ" href="/" />
    </Screen>
  );
}
