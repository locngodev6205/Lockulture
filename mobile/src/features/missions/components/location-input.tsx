import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import { Action } from '@/shared/components/action';
import { Note, commonStyles as c } from '@/shared/components/surface';
import { colors } from '@/shared/theme/tokens';
import type { Coordinates } from '@/domain/models';
function parseCoordinates(text: string): Coordinates | null {
  const parts = text.split(',').map((x) => x.trim());
  const pattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  if (parts.length !== 2 || !parts.every((x) => pattern.test(x))) return null;
  const latitude = Number(parts[0]),
    longitude = Number(parts[1]);
  return Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
    ? { latitude, longitude }
    : null;
}
type Props = { disabled: boolean; onChange: (point: Coordinates | null, label: string) => void };
export function LocationInput({ disabled, onChange }: Props) {
  const [mode, setMode] = useState<'manual' | 'gps'>('manual');
  const [draft, setDraft] = useState('16.4692, 107.5778');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const version = useRef(0);
  useEffect(
    () => () => {
      version.current++;
    },
    [],
  );
  const [gpsPoint, setGpsPoint] = useState<Coordinates | null>(null);
  const listener = useRef(onChange);
  useEffect(() => {
    listener.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const point = mode === 'manual' ? parseCoordinates(draft) : gpsPoint;
    listener.current(
      mode === 'gps' && loading ? null : point,
      mode === 'gps' && loading
        ? 'Đang lấy vị trí hiện tại…'
        : point
          ? `${mode === 'manual' ? 'Tọa độ nhập tay' : 'GPS đã lấy'}: ${point.latitude}, ${point.longitude}`
          : mode === 'manual'
            ? 'Nhập tọa độ hợp lệ để tìm nhiệm vụ'
            : 'Bấm Lấy vị trí hiện tại',
    );
  }, [mode, draft, gpsPoint, loading]);
  const manualInvalid = mode === 'manual' && draft.trim().length > 0 && !parseCoordinates(draft);
  async function gps() {
    const current = ++version.current;
    setLoading(true);
    setError('');
    try {
      const p = await Location.requestForegroundPermissionsAsync();
      if (current !== version.current) return;
      if (!p.granted) throw new Error('Chưa có quyền vị trí. Bạn có thể nhập tọa độ thay thế.');
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (current === version.current) setGpsPoint(result.coords);
    } catch (e) {
      if (current === version.current)
        setError(
          e instanceof Error ? e.message : 'Chưa lấy được GPS. Hãy thử lại hoặc nhập tọa độ.',
        );
    } finally {
      if (current === version.current) setLoading(false);
    }
  }
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {(['gps', 'manual'] as const).map((value) => (
          <View key={value} style={{ flex: 1 }}>
            <Action
              label={value === 'gps' ? 'GPS hiện tại' : 'Nhập tọa độ'}
              secondary={mode !== value}
              disabled={disabled}
              onPress={() => {
                version.current++;
                setLoading(false);
                setMode(value);
                setError('');
              }}
            />
          </View>
        ))}
      </View>
      {mode === 'gps' ? (
        <Action
          secondary
          loading={loading}
          disabled={disabled}
          label="Lấy vị trí hiện tại"
          onPress={() => void gps()}
        />
      ) : (
        <>
          <Text style={c.body}>Tọa độ (vĩ độ, kinh độ)</Text>
          <TextInput
            accessibilityLabel="Tọa độ (vĩ độ, kinh độ)"
            value={draft}
            editable={!disabled}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(text) => {
              setDraft(text);
              setError('');
            }}
            placeholder="16.4692, 107.5778"
            placeholderTextColor={colors.subtle}
            style={{
              fontSize: 16,
              lineHeight: 24,
              padding: 16,
              color: colors.text,
              backgroundColor: colors.surface,
              borderColor: manualInvalid ? colors.danger : colors.border,
              borderWidth: 1,
              borderRadius: 14,
            }}
          />
          <Note>Vĩ độ trước, kinh độ sau. Dùng dấu chấm cho phần thập phân.</Note>
          {manualInvalid && (
            <Note error>
              Nhập hai số, vĩ độ từ -90 đến 90 và kinh độ từ -180 đến 180, ngăn bằng dấu phẩy.
            </Note>
          )}
          <Action
            secondary
            disabled={disabled}
            label="Điền tọa độ mẫu Huế"
            onPress={() => {
              setDraft('16.4692, 107.5778');
              setError('');
            }}
          />
        </>
      )}
      {!!error && <Note error>{error}</Note>}
    </View>
  );
}
