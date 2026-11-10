import { useRef, useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Note, commonStyles as c } from '@/shared/components/surface';
import { people, useSocialStore } from '@/state/social-store';
import { DemoNote, SearchInput, SelectRow } from '@/features/social/ui';
export default function CreateGroupScreen() {
  const submitted = useRef(false);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const relations = useSocialStore((s) => s.relations);
  const createGroup = useSocialStore((s) => s.createGroup);
  const friends = people.filter((p) => relations[p.id] === 'friend');
  return (
    <Page title="Tạo nhóm">
      <Text style={c.title}>Tên nhóm</Text>
      <SearchInput
        label="Ví dụ: Dạo một vòng Huế"
        value={name}
        onChangeText={setName}
        maxLength={50}
      />
      <Note>{name.trim().length}/50 ký tự</Note>
      <Text style={c.title}>Thêm bạn bè ({selected.length})</Text>
      <Note>Bạn có thể tạo nhóm trước và thêm thành viên sau.</Note>
      {!friends.length && (
        <Action secondary label="Tìm bạn để thêm vào nhóm" href="/(main)/friends" />
      )}
      {friends.map((p) => (
        <SelectRow
          key={p.id}
          name={p.name}
          selected={selected.includes(p.id)}
          onPress={() =>
            setSelected((s) => (s.includes(p.id) ? s.filter((id) => id !== p.id) : [...s, p.id]))
          }
        />
      ))}
      <Action
        label="Tạo nhóm"
        disabled={!name.trim()}
        onPress={() => {
          if (submitted.current) return;
          submitted.current = true;
          const id = createGroup(name, selected);
          if (id) router.replace({ pathname: '/(main)/groups/[id]', params: { id } });
        }}
      />
      <DemoNote />
    </Page>
  );
}
