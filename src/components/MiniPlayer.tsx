import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { getChannel } from '../data/channels';
import { togglePlay } from '../player/controller';
import { usePlaybackStatus } from '../player/usePlaybackStatus';
import { usePlayerStore } from '../store/player';
import { colors, radius } from '../theme';

export function MiniPlayer() {
  const channel = usePlayerStore((s) => getChannel(s.currentId));
  const error = usePlayerStore((s) => s.error);
  const { isPlaying, isBuffering } = usePlaybackStatus();

  if (!channel) return null;

  return (
    <Pressable onPress={() => router.push('/player')} style={styles.wrap}>
      <Pressable hitSlop={10} onPress={() => togglePlay()} style={styles.button}>
        {isBuffering ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color="#FFFFFF" />
        )}
      </Pressable>
      <View style={styles.texts}>
        <View style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.channel} numberOfLines={1}>
            {channel.name}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {error ?? `${channel.frequency}MHz 라이브`}
        </Text>
      </View>
      <Ionicons name="chevron-up" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(44,44,52,0.97)',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 16,
    marginBottom: 8,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  texts: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.live, marginRight: 5 },
  channel: { color: colors.textSecondary, fontSize: 11 },
  title: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 1 },
});
