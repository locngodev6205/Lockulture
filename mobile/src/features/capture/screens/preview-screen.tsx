import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { Page } from '@/shared/components/page';
import { Action } from '@/shared/components/action';
import { Note, Surface, commonStyles as c } from '@/shared/components/surface';
import { useCaptureStore } from '@/state/capture-store';
import { useAppStore } from '@/state/app-store';
import { services } from '@/services';
import { env } from '@/config/env';
import type { CaptureScenario } from '@/domain/models';
export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const draft = useCaptureStore((s) => s.draft);
  const user = useAppStore((s) => s.mockUser);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const valid = draft && draft.id === id && draft.ownerId === user?.id;
  function retake() {
    if (!draft) return;
    useCaptureStore.getState().retake();
    router.replace({
      pathname: '/(main)/capture/camera',
      params: { mode: draft.mode, ...(draft.mission ? { missionId: draft.mission.id } : {}) },
    });
  }
  async function submit() {
    if (!valid || !draft || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError('');
    try {
      const prior = useCaptureStore
        .getState()
        .records.find((r) => r.id === draft.id && r.ownerId === user?.id);
      const result = prior ?? (await services.capture.evaluate(draft, controller.signal));
      if (controller.signal.aborted || useAppStore.getState().mockUser?.id !== draft.ownerId)
        return;
      if (draft.mode === 'mission' && !prior) {
        const mission = useAppStore.getState().activeMission;
        if (mission?.id !== draft.mission?.id || mission?.version !== draft.mission?.version)
          throw new Error('Nhiệm vụ đã thay đổi. Hãy mở camera từ nhiệm vụ hiện tại.');
      }
      const record = useCaptureStore.getState().settle(draft, result);
      if (
        record.verdict === 'completed' &&
        useAppStore.getState().activeMission?.id === record.missionId
      )
        useAppStore.getState().clearMission(record.missionId!);
      router.replace({ pathname: '/(main)/capture/result', params: { id: record.id } });
    } catch (e) {
      if (!controller.signal.aborted)
        setError(e instanceof Error ? e.message : 'Chưa thể đánh giá ảnh. Hãy thử lại.');
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  if (!valid || !draft)
    return (
      <Page title="Xem trước ảnh">
        <Note>Không còn ảnh chờ gửi. Hãy chụp một ảnh mới.</Note>
        <Action label="Mở máy ảnh" href="/(main)/(tabs)/capture" />
      </Page>
    );
  const scenarios: CaptureScenario[] = [
    'success',
    'retake_required',
    'unidentified',
    draft.mode === 'mission' ? 'not_matched' : 'out_of_scope',
    'service_error',
  ];
  const labels: Record<CaptureScenario, string> = {
    success: 'Thành công',
    retake_required: 'Ảnh mờ',
    unidentified: 'Cần thêm chi tiết',
    out_of_scope: 'Ngoài phạm vi',
    not_matched: 'Không khớp nhiệm vụ',
    service_error: 'Lỗi dịch vụ lần đầu',
  };
  return (
    <Page title="Xem trước ảnh">
      <Image
        source={{ uri: draft.photo.uri }}
        accessibilityLabel="Ảnh vừa chụp"
        style={{
          width: '100%',
          aspectRatio: draft.photo.width / draft.photo.height,
          borderRadius: 20,
        }}
        resizeMode="contain"
      />
      <Text style={c.title}>{draft.mode === 'mission' ? 'Ảnh nhiệm vụ' : 'Khám phá tự do'}</Text>
      {draft.mission && (
        <Surface>
          <Text style={c.title}>Nhắc lại yêu cầu chụp</Text>
          {draft.mission.photoRequirements.map((line) => (
            <Text key={line} style={c.body}>
              {line}
            </Text>
          ))}
        </Surface>
      )}
      {!!draft.evidence.length && (
        <Note>
          Đã giữ {draft.evidence.length} ảnh trước để bổ sung bằng chứng cho cùng đối tượng.
        </Note>
      )}
      {env.dataSource === 'mock' && (
        <Note>
          Đánh giá mẫu để thử giao diện, không phải nhận diện thật từ ảnh. Chưa gửi ảnh đến Gemini.
        </Note>
      )}
      {!!error && <Note error>{error}</Note>}
      <Action
        label={
          busy
            ? 'Đang đánh giá…'
            : error
              ? 'Thử lại'
              : draft.mode === 'mission'
                ? 'Kiểm tra nhiệm vụ'
                : 'Khám phá ảnh'
        }
        loading={busy}
        onPress={() => void submit()}
      />
      <Action secondary disabled={busy} label="Chụp lại" onPress={retake} />
      {__DEV__ && env.dataSource === 'mock' && (
        <View style={{ gap: 12 }}>
          <Action
            secondary
            disabled={busy}
            label={debug ? 'Ẩn tình huống thử' : 'Tình huống đánh giá mẫu'}
            onPress={() => setDebug(!debug)}
          />
          {debug &&
            scenarios.map((value) => (
              <Action
                key={value}
                disabled={busy}
                secondary={draft.scenario !== value}
                label={labels[value]}
                onPress={() => {
                  useCaptureStore.getState().setScenario(value);
                  const next = useCaptureStore.getState().draft!;
                  router.setParams({ id: next.id });
                }}
              />
            ))}
        </View>
      )}
    </Page>
  );
}
