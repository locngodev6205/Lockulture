import { useRef, type ComponentRef } from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PostAudienceLabel } from '@/features/feed/components/post-audience';
import { DiscoveryPost } from '@/features/feed/components/discovery-post';
import { useCaptureStore } from '@/state/capture-store';
import { useAppStore } from '@/state/app-store';
import { Action } from '@/shared/components/action';
import { colors } from '@/shared/theme/tokens';
import { env } from '@/config/env';
export default function FeedScreen() {
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const user = useAppStore((s) => s.mockUser);
  const posts = useCaptureStore((s) => s.posts);
  const own = posts.filter((p) => p.ownerId === user?.id);
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 22, paddingBottom: 36, gap: 24 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Bảng tin</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(
              [
                { label: 'Bảng xếp hạng', icon: 'trophy-outline', href: '/(main)/leaderboard' },
                { label: 'Bạn bè', icon: 'person-outline', href: '/(main)/friends' },
                { label: 'Nhóm của tôi', icon: 'people-outline', href: '/(main)/groups' },
              ] as const
            ).map((item) => (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => router.push(item.href)}
                style={styles.icon}
              >
                <Ionicons name={item.icon} size={25} color={colors.accent} />
              </Pressable>
            ))}
          </View>
        </View>
        {env.dataSource === 'mock' && (
          <DiscoveryPost
            sample
            post={{
              id: 'sample-minh-an-street',
              authorName: 'Minh An',
              subjectName: 'Biển tên đường Trần Hưng Đạo',
              caption: 'Một tên đường quen, một câu chuyện đáng tìm hiểu.',
            }}
          />
        )}
        {own.map((post) => (
          <DiscoveryPost key={post.id} post={post}>
            <PostAudienceLabel audience={post.audience} ownerId={post.ownerId} />
          </DiscoveryPost>
        ))}
        {env.dataSource !== 'mock' && (
          <Text style={{ color: colors.muted }}>Bảng tin từ máy chủ chưa được tích hợp.</Text>
        )}
        <Text style={{ color: colors.subtle, fontSize: 14, lineHeight: 22 }}>
          Cảm xúc và bình luận được lưu trên thiết bị, chưa gửi đến người khác.
        </Text>
        <Action
          secondary
          label="Quay lên đầu"
          onPress={() => scroll.current?.scrollTo({ y: 0, animated: true })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontSize: 30, fontWeight: '700', color: colors.text, flexShrink: 1 },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
