import { Text } from 'react-native';
import type { PostAudience } from '@/state/capture-store';
import { people } from '@/state/social-store';
import { commonStyles as c } from '@/shared/components/surface';
export function PostAudienceLabel({
  audience,
  ownerId,
}: {
  audience?: PostAudience;
  ownerId: string;
}) {
  if (!audience) return <Text style={c.label}>Bài demo cũ · chưa có thông tin người nhận</Text>;
  const ids = new Set(
    [...audience.friendIds, ...audience.groups.flatMap((g) => g.memberIds)].filter(
      (id) => id !== ownerId,
    ),
  );
  const friends = audience.friendIds.map((id) => people.find((p) => p.id === id)?.name ?? 'Bạn bè');
  const groups = audience.groups.map((g) => g.name);
  return (
    <Text style={c.label}>
      Đã gửi đến {ids.size} người{friends.length ? ` · ${friends.join(', ')}` : ''}
      {groups.length ? ` · Nhóm: ${groups.join(', ')}` : ''}
    </Text>
  );
}
