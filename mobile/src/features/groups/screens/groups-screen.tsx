import { useState } from 'react';
import { Text } from 'react-native';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Surface, Note, commonStyles as c } from '@/shared/components/surface';
import { useSocialStore } from '@/state/social-store';
import { DemoNote, SearchInput } from '@/features/social/ui';
export default function GroupsScreen() {
  const groups = useSocialStore((s) => s.groups);
  const [query, setQuery] = useState('');
  const shown = groups.filter((g) =>
    g.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <Page tabs title="Nhóm của tôi">
      <Action label="Tạo nhóm" href="/(main)/groups/create" />
      <SearchInput label="Tìm nhóm" value={query} onChangeText={setQuery} />
      {!shown.length && (
        <Note>
          {groups.length
            ? 'Không tìm thấy nhóm phù hợp.'
            : 'Chưa có nhóm. Tạo nhóm để chia sẻ những khám phá cùng bạn bè.'}
        </Note>
      )}
      {shown.map((g) => (
        <Surface key={g.id}>
          <Text style={c.title}>{g.name}</Text>
          <Text style={c.body}>
            {g.memberIds.length} thành viên · {g.postIds.length} bài chia sẻ
          </Text>
          <Action
            secondary
            label={`Mở nhóm ${g.name}`}
            href={{ pathname: '/(main)/groups/[id]', params: { id: g.id } }}
          />
        </Surface>
      ))}
      <DemoNote />
    </Page>
  );
}
