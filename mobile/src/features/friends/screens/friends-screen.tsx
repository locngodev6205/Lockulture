import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Surface, Note, commonStyles as c } from '@/shared/components/surface';
import { people, useSocialStore, type Relation } from '@/state/social-store';
import { DemoNote, Person, SearchInput } from '@/features/social/ui';
export default function FriendsScreen() {
  const [tab, setTab] = useState<'friend' | 'requests' | 'search'>('friend');
  const [query, setQuery] = useState('');
  const relations = useSocialStore((s) => s.relations);
  const relate = useSocialStore((s) => s.relate);
  const [notice, setNotice] = useState('');
  const update = (id: string, next: Relation | null, message: string) => {
    relate(id, next);
    setNotice(message);
  };
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .toLowerCase();
  const list = people.filter(
    (p) =>
      (tab === 'search' ||
        (tab === 'friend'
          ? relations[p.id] === 'friend'
          : ['incoming', 'outgoing'].includes(relations[p.id]))) &&
      normalize(`${p.name} ${p.handle}`).includes(normalize(query.trim())),
  );
  return (
    <Page tabs title="Bạn bè">
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['friend', 'requests', 'search'] as const).map((key, i) => (
          <View key={key} style={{ flex: 1 }}>
            <Action
              secondary={tab !== key}
              label={['Bạn bè', 'Lời mời', 'Tìm bạn'][i]}
              onPress={() => {
                setTab(key);
                setNotice('');
              }}
            />
          </View>
        ))}
      </View>
      <SearchInput label="Tìm tên hoặc tên người dùng" value={query} onChangeText={setQuery} />
      {!!notice && (
        <Text accessibilityLiveRegion="polite" style={c.body}>
          {notice}
        </Text>
      )}
      {!list.length && (
        <Note>
          {tab === 'friend'
            ? 'Chưa có bạn phù hợp. Mở Tìm bạn để kết nối.'
            : tab === 'requests'
              ? 'Không có lời mời phù hợp.'
              : 'Không tìm thấy người dùng trong danh sách demo.'}
        </Note>
      )}
      {list.map((p) => (
        <Surface key={p.id}>
          <Person
            name={p.name}
            detail={`@${p.handle}`}
            onPress={() => router.push({ pathname: '/(main)/friends/[id]', params: { id: p.id } })}
          />
          {relations[p.id] === 'incoming' ? (
            <>
              <Note>Đã gửi lời mời kết bạn cho bạn.</Note>
              <Action
                label={`Chấp nhận ${p.name}`}
                onPress={() => update(p.id, 'friend', `Bạn và ${p.name} đã trở thành bạn bè.`)}
              />
              <Action
                secondary
                label={`Từ chối ${p.name}`}
                onPress={() => update(p.id, null, 'Đã từ chối lời mời.')}
              />
            </>
          ) : relations[p.id] === 'outgoing' ? (
            <>
              <Note>Đang chờ phản hồi.</Note>
              <Action
                secondary
                label={`Hủy lời mời ${p.name}`}
                onPress={() => update(p.id, null, 'Đã hủy lời mời.')}
              />
            </>
          ) : relations[p.id] === 'friend' ? (
            <Note>Đã là bạn bè</Note>
          ) : (
            <Action
              label={`Kết bạn với ${p.name}`}
              onPress={() => update(p.id, 'outgoing', 'Đã lưu lời mời trong demo.')}
            />
          )}
        </Surface>
      ))}
      <DemoNote />
    </Page>
  );
}
