import { DiscoveryPost } from '@/features/feed/components/discovery-post';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Note, Surface, commonStyles as c } from '@/shared/components/surface';
import { people, useSocialStore } from '@/state/social-store';
import { useCaptureStore } from '@/state/capture-store';
import { useAppStore } from '@/state/app-store';
import { Confirm, DemoNote, Person, SearchInput, SelectRow } from '@/features/social/ui';
export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = useSocialStore((s) => s.groups.find((g) => g.id === id));
  const relations = useSocialStore((s) => s.relations);
  const renameGroup = useSocialStore((s) => s.renameGroup);
  const addMembers = useSocialStore((s) => s.addMembers);
  const removeMember = useSocialStore((s) => s.removeMember);
  const leaveGroup = useSocialStore((s) => s.leaveGroup);
  const sharePost = useSocialStore((s) => s.sharePost);
  const user = useAppStore((s) => s.mockUser);
  const allPosts = useCaptureStore((s) => s.posts);
  const posts = allPosts.filter((p) => p.ownerId === user?.id);
  const [tab, setTab] = useState<'feed' | 'members'>('feed');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [sharing, setSharing] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  if (!group)
    return (
      <Page title="Nhóm">
        <Note>Nhóm không còn tồn tại hoặc bạn đã rời nhóm.</Note>
        <Action label="Về danh sách nhóm" href="/(main)/groups" />
      </Page>
    );
  const admin = group.ownerId === 'mock-user';
  const candidates = people.filter(
    (p) => relations[p.id] === 'friend' && !group.memberIds.includes(p.id),
  );
  const available = posts.filter(
    (p) => !group.postIds.includes(p.id) && !p.audience?.groups.some((g) => g.id === id),
  );
  const shared = posts.filter(
    (p) => group.postIds.includes(p.id) || p.audience?.groups.some((g) => g.id === id),
  );
  return (
    <Page title={group.name}>
      <Text style={c.body}>
        {group.memberIds.length} thành viên{admin ? ' · Bạn là trưởng nhóm' : ''}
      </Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Action label="Bảng tin" secondary={tab !== 'feed'} onPress={() => setTab('feed')} />
        </View>
        <View style={{ flex: 1 }}>
          <Action
            label="Thành viên"
            secondary={tab !== 'members'}
            onPress={() => setTab('members')}
          />
        </View>
      </View>
      {tab === 'feed' ? (
        <>
          <Action label="Chia sẻ khám phá vào nhóm" onPress={() => setSharing(!sharing)} />
          {sharing && (
            <Surface>
              <Text style={c.title}>Chọn bài đã đăng</Text>
              <Note>Chỉ bài bạn xác nhận chia sẻ mới được thêm vào nhóm.</Note>
              {!available.length && (
                <>
                  <Note>Chưa có bài mới để chia sẻ. Chụp khám phá và đăng bài trước.</Note>
                  <Action secondary label="Mở máy ảnh" href="/(main)/(tabs)/capture" />
                </>
              )}
              {available.map((p) => (
                <Action
                  key={p.id}
                  secondary
                  label={`Chia sẻ: ${p.subjectName}`}
                  onPress={() => {
                    sharePost(id, p.id);
                    setSharing(false);
                  }}
                />
              ))}
              <Action secondary label="Đóng danh sách bài" onPress={() => setSharing(false)} />
            </Surface>
          )}
          {!shared.length && (
            <Surface>
              <Text style={c.title}>Câu chuyện đầu tiên của nhóm</Text>
              <Text style={c.body}>Chia sẻ một khám phá để bắt đầu bảng tin chung.</Text>
            </Surface>
          )}
          {shared.map((p) => (
            <DiscoveryPost key={p.id} post={p} />
          ))}
        </>
      ) : (
        <>
          {group.memberIds.map((member) => {
            const p = people.find((p) => p.id === member);
            const own = member === 'mock-user';
            return (
              <Surface key={member}>
                <Person
                  name={own ? `${user?.displayName ?? 'Bạn'} (bạn)` : (p?.name ?? 'Thành viên')}
                  detail={member === group.ownerId ? 'Trưởng nhóm' : 'Thành viên'}
                  onPress={
                    !own && p
                      ? () =>
                          router.push({ pathname: '/(main)/friends/[id]', params: { id: member } })
                      : undefined
                  }
                />
                {admin && !own && (
                  <Action
                    secondary
                    label={`Xóa ${p?.name ?? 'thành viên'} khỏi nhóm`}
                    onPress={() => setConfirm(member)}
                  />
                )}
              </Surface>
            );
          })}
          {admin && (
            <>
              <Action
                label="Thêm thành viên"
                onPress={() => {
                  setAdding(!adding);
                  setSelected([]);
                }}
              />
              {adding && (
                <Surface>
                  <Text style={c.title}>Chọn bạn bè</Text>
                  {!candidates.length && (
                    <Note>Tất cả bạn bè đã ở trong nhóm. Kết nối thêm bạn để mở rộng nhóm.</Note>
                  )}
                  {candidates.map((p) => (
                    <SelectRow
                      key={p.id}
                      name={p.name}
                      selected={selected.includes(p.id)}
                      onPress={() =>
                        setSelected((s) =>
                          s.includes(p.id) ? s.filter((v) => v !== p.id) : [...s, p.id],
                        )
                      }
                    />
                  ))}
                  <Action
                    disabled={!selected.length}
                    label="Xác nhận thêm thành viên"
                    onPress={() => {
                      addMembers(id, selected);
                      setAdding(false);
                      setSelected([]);
                    }}
                  />
                  <Action secondary label="Hủy thêm thành viên" onPress={() => setAdding(false)} />
                </Surface>
              )}
              <Action
                secondary
                label="Đổi tên nhóm"
                onPress={() => {
                  setName(group.name);
                  setEditing(true);
                }}
              />
              {editing && (
                <Surface>
                  <SearchInput
                    label="Tên nhóm"
                    value={name}
                    onChangeText={setName}
                    maxLength={50}
                  />
                  <Action
                    label="Lưu tên nhóm"
                    disabled={!name.trim()}
                    onPress={() => {
                      renameGroup(id, name);
                      setEditing(false);
                    }}
                  />
                  <Action secondary label="Hủy đổi tên" onPress={() => setEditing(false)} />
                </Surface>
              )}
            </>
          )}
          <Action
            secondary
            label={admin ? 'Giải tán nhóm' : 'Rời nhóm'}
            onPress={() => setConfirm('leave')}
          />
          {confirm && (
            <Confirm
              label={
                confirm === 'leave'
                  ? admin
                    ? 'Xác nhận giải tán'
                    : 'Xác nhận rời nhóm'
                  : 'Xác nhận xóa thành viên'
              }
              onCancel={() => setConfirm(null)}
              onConfirm={() => {
                if (confirm === 'leave') {
                  leaveGroup(id);
                  router.replace('/(main)/groups');
                } else removeMember(id, confirm);
                setConfirm(null);
              }}
            >
              {confirm === 'leave'
                ? admin
                  ? 'Giải tán nhóm và xóa bảng tin nhóm trên thiết bị này? Các bài gốc vẫn được giữ.'
                  : 'Rời nhóm này?'
                : `Xóa ${people.find((p) => p.id === confirm)?.name ?? 'thành viên'} khỏi nhóm?`}
            </Confirm>
          )}
        </>
      )}
      <DemoNote />
    </Page>
  );
}
