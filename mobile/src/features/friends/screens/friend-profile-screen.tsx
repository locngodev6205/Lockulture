import { useState } from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Note, Surface, commonStyles as c } from '@/shared/components/surface';
import { people, useSocialStore } from '@/state/social-store';
import { Confirm, DemoNote, Person } from '@/features/social/ui';
export default function FriendProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = people.find((p) => p.id === id);
  const relation = useSocialStore((s) => s.relations[id]);
  const relate = useSocialStore((s) => s.relate);
  const [confirm, setConfirm] = useState(false);
  return (
    <Page title="Hồ sơ bạn bè">
      {!person ? (
        <Note>Không tìm thấy người dùng.</Note>
      ) : (
        <>
          <Surface>
            <Person name={person.name} detail={`@${person.handle}`} />
            <Text style={c.body}>{person.bio}</Text>
            <Text style={c.title}>{person.xp} XP</Text>
            <Note>Tiến trình mẫu của người dùng demo.</Note>
          </Surface>
          {relation === 'friend' ? (
            <>
              <Note>Hai bạn đã kết nối.</Note>
              <Action secondary label="Xóa bạn bè" onPress={() => setConfirm(true)} />
            </>
          ) : relation === 'incoming' ? (
            <>
              <Action label="Chấp nhận lời mời" onPress={() => relate(id, 'friend')} />
              <Action secondary label="Từ chối lời mời" onPress={() => relate(id, null)} />
            </>
          ) : relation === 'outgoing' ? (
            <>
              <Note>Đang chờ phản hồi.</Note>
              <Action secondary label="Hủy lời mời" onPress={() => relate(id, null)} />
              <Action
                secondary
                label="Mô phỏng người này chấp nhận"
                onPress={() => relate(id, 'friend')}
              />
            </>
          ) : (
            <Action label="Gửi lời mời kết bạn" onPress={() => relate(id, 'outgoing')} />
          )}
          {confirm && relation === 'friend' && (
            <Confirm
              label="Xác nhận xóa bạn"
              onCancel={() => setConfirm(false)}
              onConfirm={() => {
                relate(id, null);
                setConfirm(false);
              }}
            >
              Xóa {person.name} khỏi danh sách bạn bè? Các nhóm chung vẫn được giữ.
            </Confirm>
          )}
          <DemoNote />
        </>
      )}
    </Page>
  );
}
