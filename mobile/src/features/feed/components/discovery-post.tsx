import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/shared/theme/tokens';
import { commonStyles as c } from '@/shared/components/surface';
import { useAppStore } from '@/state/app-store';
import { reactions, useFeedInteractions } from '@/state/feed-interaction-store';
export type DiscoveryPostData = {
  id: string;
  authorName: string;
  subjectName: string;
  caption: string;
  photoUri?: string;
};
export function DiscoveryPost({
  post,
  sample = false,
  children,
}: {
  post: DiscoveryPostData;
  sample?: boolean;
  children?: React.ReactNode;
}) {
  const user = useAppStore((s) => s.mockUser);
  const key = `${user?.id}:${post.id}`;
  const reaction = useFeedInteractions((s) => s.reactions[key]);
  const allComments = useFeedInteractions((s) => s.comments);
  const comments = allComments[key] ?? [];
  const react = useFeedInteractions((s) => s.react);
  const comment = useFeedInteractions((s) => s.comment);
  const remove = useFeedInteractions((s) => s.remove);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  return (
    <View style={styles.post}>
      <Text style={c.title}>
        {post.authorName} — {post.subjectName}
      </Text>
      <View style={styles.photo}>
        {post.photoUri ? (
          <Image
            accessibilityLabel={post.subjectName}
            source={{ uri: post.photoUri }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={styles.illustration}>
            <View style={styles.sign}>
              <Text style={styles.signText}>ĐƯỜNG</Text>
              <Text style={[styles.signText, { fontSize: 24 }]}>TRẦN HƯNG ĐẠO</Text>
            </View>
            <View style={styles.pole} />
            <Text style={styles.sample}>Ảnh minh họa cho bài demo</Text>
          </View>
        )}
        {!!post.caption && (
          <View style={styles.caption}>
            <Text numberOfLines={6} style={styles.captionText}>
              {post.caption}
            </Text>
          </View>
        )}
      </View>
      {children}
      {sample && <Text style={c.label}>Bài mẫu từ Minh An · gửi riêng cho bạn</Text>}
      <View style={styles.row}>
        {reactions.map((emoji) => (
          <Pressable
            key={emoji}
            accessibilityRole="button"
            accessibilityLabel={`Thả ${emoji} cho ${post.authorName}`}
            accessibilityState={{ selected: reaction === emoji }}
            onPress={() => react(key, emoji)}
            style={[
              styles.reaction,
              reaction === emoji && {
                borderColor: colors.accent,
                backgroundColor: colors.accentSurface,
              },
            ]}
          >
            <Text style={{ fontSize: 24 }}>{emoji}</Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Bình luận về ${post.subjectName}`}
          onPress={() => setOpen(!open)}
          style={styles.commentButton}
        >
          <Text style={c.body}>Bình luận ({comments.length})</Text>
        </Pressable>
      </View>
      {open && (
        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TextInput
              accessibilityLabel={`Viết bình luận về ${post.subjectName}`}
              value={text}
              onChangeText={setText}
              maxLength={300}
              multiline
              placeholder="Viết bình luận…"
              placeholderTextColor={colors.subtle}
              style={[styles.input, { flex: 1 }]}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Gửi bình luận"
              accessibilityState={{ disabled: !text.trim() || !user }}
              style={({ pressed }) => ({
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.accent,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: !text.trim() || !user || pressed ? 0.45 : 1,
              })}
              disabled={!text.trim() || !user}
              onPress={() => {
                if (!user || !text.trim()) return;
                comment(key, user.id, user.displayName, text);
                setText('');
              }}
            >
              <Ionicons name="paper-plane-outline" size={24} color={colors.background} />
            </Pressable>
          </View>
          {!comments.length && (
            <Text style={c.label}>Chưa có bình luận. Chia sẻ điều bạn thấy thú vị.</Text>
          )}
          {comments.map((item) => (
            <View key={item.id} style={styles.comment}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <Text style={[c.title, { flex: 1 }]}>{item.authorName}</Text>
                {item.authorId === user?.id && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Xóa bình luận: ${item.text}`}
                    onPress={() => remove(key, item.id, user.id)}
                    style={{
                      minHeight: 44,
                      minWidth: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="trash-outline" size={22} color={colors.accent} />
                  </Pressable>
                )}
              </View>
              <Text style={c.body}>{item.text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  post: { gap: 14, paddingBottom: 24, borderBottomWidth: 1, borderColor: colors.border },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  caption: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    maxWidth: '90%',
    maxHeight: '60%',
    backgroundColor: 'rgba(210,210,210,0.78)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  captionText: { color: '#000000', fontSize: 16, lineHeight: 23, textAlign: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  reaction: {
    minWidth: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentButton: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 6 },
  comment: { backgroundColor: colors.surface, padding: 14, borderRadius: 14, gap: 6 },
  input: {
    color: colors.text,
    fontSize: 16,
    minHeight: 70,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 14,
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#72948B',
  },
  sign: {
    backgroundColor: '#204D75',
    borderWidth: 2,
    borderColor: '#E9EEE8',
    padding: 15,
    borderRadius: 6,
    zIndex: 1,
  },
  signText: { color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontWeight: '700' },
  pole: { width: 12, height: 90, backgroundColor: '#B5B7B3' },
  sample: { color: '#14332E', fontSize: 14, position: 'absolute', top: 18 },
});
