import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Channel } from '../data/channels';
import { playChannelById } from '../player/controller';
import { usePlaybackStatus } from '../player/usePlaybackStatus';
import { usePlayerStore } from '../store/player';
import { usePrefs } from '../store/prefs';
import { colors, radius } from '../theme';
import { ChannelArt } from './ChannelArt';
import { Equalizer } from './Equalizer';

export function ChannelCard({ channel, recent }: { channel: Channel; recent: boolean }) {
  const isCurrent = usePlayerStore((s) => s.currentId === channel.id);
  const isFavorite = usePrefs((s) => s.favorites.includes(channel.id));
  const toggleFavorite = usePrefs((s) => s.toggleFavorite);
  const { isPlaying, isBuffering } = usePlaybackStatus();

  return (
    <Pressable
      onPress={() => playChannelById(channel.id, { fromUser: true })}
      style={({ pressed }) => [styles.card, isCurrent && styles.active, pressed && { opacity: 0.85 }]}
    >
      <ChannelArt channel={channel} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.shade} />

      <Pressable hitSlop={10} onPress={() => toggleFavorite(channel.id)} style={styles.star}>
        <Ionicons
          name={isFavorite ? 'star' : 'star-outline'}
          size={13}
          color={isFavorite ? colors.primary : '#FFFFFF'}
        />
      </Pressable>

      <View style={styles.info}>
        {recent && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>최근</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>
          {channel.name}
        </Text>
        <View style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.sub} numberOfLines={1}>
            {channel.frequency}MHz 라이브
          </Text>
        </View>
      </View>

      {isCurrent && (
        <View style={styles.playing}>
          {isBuffering ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Equalizer active={isPlaying} size={11} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.95,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  active: { borderColor: colors.primary },
  shade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%' },
  star: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { position: 'absolute', left: 10, right: 10, bottom: 10 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginBottom: 4,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  name: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.live, marginRight: 5 },
  sub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, flexShrink: 1 },
  playing: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
