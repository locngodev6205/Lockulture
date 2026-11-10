import { useEffect, useRef, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Era } from '@/domain/models';
import { colors } from '@/shared/theme/tokens';

const NODE_WIDTH = 120;

type Props = { eras: Era[]; selectedId: string; onSelect: (id: string) => void };
export function EraTimeline({ eras, selectedId, onSelect }: Props) {
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useEffect(() => {
    const index = eras.findIndex((era) => era.id === selectedId);
    if (index >= 0)
      scroll.current?.scrollTo({ x: Math.max(0, index * NODE_WIDTH - NODE_WIDTH), animated: true });
  }, [eras, selectedId]);
  return (
    <ScrollView
      ref={scroll}
      horizontal
      nestedScrollEnabled
      directionalLockEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.track}
      accessibilityLabel="Dòng thời gian lịch sử, cuộn ngang để chọn thời kỳ"
    >
      {eras.map((era, index) => {
        const selected = selectedId === era.id;
        const decoded = era.status === 'decoded';
        return (
          <Pressable
            key={era.id}
            onPress={() => onSelect(era.id)}
            accessibilityRole="button"
            accessibilityLabel={`${era.name}, ${era.fragmentCount} trên ${era.fragmentGoal} mảnh ghép`}
            accessibilityState={{ selected }}
            style={({ pressed }) => [styles.node, pressed && styles.pressed]}
          >
            <View style={styles.rail}>
              {index > 0 && <View style={[styles.line, styles.leftLine]} />}
              {index < eras.length - 1 && <View style={[styles.line, styles.rightLine]} />}
              <View
                style={[
                  styles.circle,
                  selected && styles.selectedCircle,
                  decoded && !selected && styles.decodedCircle,
                ]}
              >
                {decoded ? (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={selected ? colors.background : colors.accent}
                  />
                ) : (
                  <Text style={[styles.number, selected && styles.selectedNumber]}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                )}
              </View>
            </View>
            <Text style={[styles.name, selected && styles.selectedName]}>{era.name}</Text>
            <View style={[styles.dot, selected && styles.selectedDot]} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  track: { paddingVertical: 8 },
  node: { width: NODE_WIDTH, alignItems: 'center', gap: 12 },
  pressed: { opacity: 0.65 },
  rail: { height: 52, width: '100%', alignItems: 'center', justifyContent: 'center' },
  line: { position: 'absolute', top: 25, height: 1, width: 37, backgroundColor: colors.border },
  leftLine: { left: 0 },
  rightLine: { right: 0 },
  circle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: { borderColor: colors.accent, backgroundColor: colors.accent },
  decodedCircle: { borderColor: colors.accent },
  number: { color: colors.subtle, fontSize: 16, fontWeight: '600' },
  selectedNumber: { color: colors.background },
  name: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 6,
  },
  selectedName: { color: colors.text, fontWeight: '600' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'transparent' },
  selectedDot: { backgroundColor: colors.accent },
});
