import { Image, Text } from 'react-native';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Note, Surface, commonStyles as c } from '@/shared/components/surface';
import { useCaptureStore } from '@/state/capture-store';
import { useAppStore } from '@/state/app-store';
export default function CollectionScreen() {
  const user = useAppStore((s) => s.mockUser);
  const records = useCaptureStore((s) => s.records).filter(
    (r) => r.ownerId === user?.id && (r.verdict === 'accepted' || r.verdict === 'completed'),
  );
  return (
    <Page title="Bộ sưu tập">
      {!records.length && <Note>Chưa có khám phá. Chụp ảnh đầu tiên để bắt đầu.</Note>}
      {records.map((record) => (
        <Surface key={record.id}>
          <Image
            source={{ uri: record.photo.uri }}
            style={{ width: '100%', aspectRatio: 1, borderRadius: 14 }}
          />
          <Text style={c.title}>{record.name}</Text>
          <Action
            secondary
            label="Xem khám phá"
            href={{ pathname: '/(main)/capture/result', params: { id: record.id } }}
          />
        </Surface>
      ))}
      <Action
        label="Chụp khám phá"
        href={{ pathname: '/(main)/capture/camera', params: { mode: 'free' } }}
      />
    </Page>
  );
}
