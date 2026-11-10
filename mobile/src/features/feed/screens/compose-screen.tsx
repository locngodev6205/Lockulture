import { useRef, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Image, Text, TextInput, View } from 'react-native';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Note, Surface, commonStyles as c } from '@/shared/components/surface';
import { colors } from '@/shared/theme/tokens';
import { useAppStore } from '@/state/app-store';
import { useCaptureStore } from '@/state/capture-store';
import { people, useSocialStore } from '@/state/social-store';
import { SearchInput, SelectRow } from '@/features/social/ui';
export default function ComposeScreen() {
  const { discoveryId } = useLocalSearchParams<{ discoveryId: string }>();
  const user = useAppStore((s) => s.mockUser);
  const records = useCaptureStore((s) => s.records);
  const posts = useCaptureStore((s) => s.posts);
  const relations = useSocialStore((s) => s.relations);
  const groups = useSocialStore((s) => s.groups);
  const [caption, setCaption] = useState('');
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [picker, setPicker] = useState(false);
  const [tab, setTab] = useState<'friends' | 'groups'>('friends');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const lock = useRef(false);
  const record = records.find(
    (r) =>
      r.ownerId === user?.id &&
      r.id === discoveryId &&
      ['accepted', 'completed'].includes(r.verdict),
  );
  const friends = people.filter((p) => relations[p.id] === 'friend');
  const joined = groups.filter((g) => g.memberIds.includes(user?.id ?? ''));
  const selectedFriends = friendIds.filter((id) => friends.some((p) => p.id === id));
  const selectedGroups = joined.filter((g) => groupIds.includes(g.id));
  const matches = (name: string) =>
    name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  const alreadySent = posts.some((p) => p.id === discoveryId && p.ownerId === user?.id);
  const toggle = (id: string, ids: string[], set: (ids: string[]) => void) =>
    set(ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id]);
  if (!record)
    return (
      <Page title="Chia sẻ">
        <Note>Chọn một khám phá đã hoàn thành từ bộ sưu tập.</Note>
        <Action label="Mở bộ sưu tập" href="/(main)/collection" />
      </Page>
    );
  if (alreadySent)
    return (
      <Page title="Đã gửi khám phá">
        <Note>
          Bài này đã được gửi. Bạn có thể xem lại ở bảng tin hoặc chia sẻ thêm từ trang nhóm.
        </Note>
        <Action label="Mở bảng tin" href="/(main)/(tabs)/feed" />
      </Page>
    );
  return (
    <Page title="Chia sẻ khám phá">
      <Image
        source={{ uri: record.photo.uri }}
        style={{ width: '100%', aspectRatio: 1, borderRadius: 20 }}
      />
      <TextInput
        accessibilityLabel="Chú thích"
        value={caption}
        onChangeText={setCaption}
        multiline
        maxLength={500}
        placeholder="Viết điều bạn muốn kể…"
        placeholderTextColor={colors.subtle}
        style={{
          fontSize: 16,
          lineHeight: 25,
          minHeight: 110,
          color: colors.text,
          backgroundColor: colors.surface,
          padding: 16,
          borderRadius: 14,
        }}
      />
      <Surface>
        <Text style={c.title}>Gửi đến</Text>
        <Text accessibilityLiveRegion="polite" style={c.body}>
          {selectedFriends.length || selectedGroups.length
            ? `${selectedFriends.length} bạn bè, ${selectedGroups.length} nhóm`
            : 'Chưa chọn người nhận'}
        </Text>
        {selectedFriends.length > 0 && (
          <Note>
            {friends
              .filter((p) => selectedFriends.includes(p.id))
              .map((p) => p.name)
              .join(', ')}
          </Note>
        )}
        {selectedGroups.length > 0 && (
          <Note>Nhóm: {selectedGroups.map((g) => g.name).join(', ')}</Note>
        )}
        <Action
          secondary
          label={picker ? 'Xong' : 'Chọn người nhận'}
          onPress={() => setPicker(!picker)}
        />
      </Surface>
      {picker && (
        <Surface>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(['friends', 'groups'] as const).map((t) => (
              <View style={{ flex: 1 }} key={t}>
                <Action
                  label={t === 'friends' ? 'Bạn bè' : 'Nhóm'}
                  secondary={tab !== t}
                  onPress={() => {
                    setTab(t);
                    setQuery('');
                  }}
                />
              </View>
            ))}
          </View>
          <SearchInput label="Tìm người nhận" value={query} onChangeText={setQuery} />
          {query.trim() &&
            !(tab === 'friends'
              ? friends.some((p) => matches(p.name))
              : joined.some((g) => matches(g.name))) && (
              <Note>Không tìm thấy người nhận phù hợp.</Note>
            )}
          {tab === 'friends' ? (
            <>
              {!!friends.length && (
                <SelectRow
                  name="Tất cả bạn bè"
                  selected={selectedFriends.length === friends.length}
                  onPress={() =>
                    setFriendIds(
                      selectedFriends.length === friends.length ? [] : friends.map((p) => p.id),
                    )
                  }
                />
              )}
              {!friends.length && (
                <>
                  <Note>Chưa có bạn bè để gửi khám phá.</Note>
                  <Action secondary label="Mở bạn bè" href="/(main)/friends" />
                </>
              )}
              {friends
                .filter((p) =>
                  p.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
                )
                .map((p) => (
                  <SelectRow
                    key={p.id}
                    name={p.name}
                    selected={selectedFriends.includes(p.id)}
                    onPress={() => toggle(p.id, friendIds, setFriendIds)}
                  />
                ))}
            </>
          ) : (
            <>
              <Note>
                Mọi thành viên hiện tại trong nhóm được chọn đều có thể xem bài. Thành viên thêm sau
                không nằm trong danh sách nhận bài này.
              </Note>
              {!joined.length && (
                <>
                  <Note>Bạn chưa tham gia nhóm nào.</Note>
                  <Action secondary label="Mở nhóm" href="/(main)/groups" />
                </>
              )}
              {joined
                .filter((g) =>
                  g.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
                )
                .map((g) => (
                  <SelectRow
                    key={g.id}
                    name={`${g.name} (${g.memberIds.length} thành viên)`}
                    selected={groupIds.includes(g.id)}
                    onPress={() => toggle(g.id, groupIds, setGroupIds)}
                  />
                ))}
            </>
          )}
        </Surface>
      )}
      {!!error && <Note error>{error}</Note>}
      <Action
        label="Gửi khám phá"
        disabled={!selectedFriends.length && !selectedGroups.length}
        onPress={() => {
          if (lock.current || !user) return;
          lock.current = true;
          const sent = useCaptureStore.getState().publish(record.id, caption, user.displayName, {
            friendIds: selectedFriends,
            groups: selectedGroups.map((g) => ({
              id: g.id,
              name: g.name,
              memberIds: [...g.memberIds],
            })),
          });
          if (!sent) {
            lock.current = false;
            setError('Chưa gửi được. Kiểm tra người nhận hoặc mở bảng tin nếu bài đã gửi.');
            return;
          }
          selectedGroups.forEach((g) => useSocialStore.getState().sharePost(g.id, record.id));
          router.replace('/(main)/(tabs)/feed');
        }}
      />
      <Note>
        Chỉ lưu mô phỏng trên thiết bị. Chưa gửi đến người dùng thật. Không chia sẻ vẫn giữ XP và
        mảnh ghép.
      </Note>
    </Page>
  );
}
