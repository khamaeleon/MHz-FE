import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChannelArt } from '../src/components/ChannelArt';
import { Equalizer } from '../src/components/Equalizer';
import { getChannel } from '../src/data/channels';
import { playNext, playPrev, togglePlay } from '../src/player/controller';
import { usePlaybackStatus } from '../src/player/usePlaybackStatus';
import { usePlayerStore } from '../src/store/player';
import { usePrefs } from '../src/store/prefs';
import { colors, radius } from '../src/theme';

type Tab = 'next' | 'songs';

export default function PlayerScreen() {
  const channel = usePlayerStore((s) => getChannel(s.currentId));
  const error = usePlayerStore((s) => s.error);
  const isFavorite = usePrefs((s) => (channel ? s.favorites.includes(channel.id) : false));
  const toggleFavorite = usePrefs((s) => s.toggleFavorite);
  const { isPlaying, isBuffering } = usePlaybackStatus();
  const [tab, setTab] = useState<Tab>('next');

  if (!channel) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <Text style={styles.emptyTitle}>재생 중인 채널이 없어요</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>닫기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={[`${channel.colors[0]}99`, colors.bg, colors.bg]} style={styles.screen}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>{channel.name}</Text>
          <Pressable hitSlop={10} onPress={() => toggleFavorite(channel.id)} style={styles.headerButton}>
            <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.artWrap}>
          <ChannelArt channel={channel} size={210} style={styles.art} />
          <View style={styles.onAir}>
            <View style={styles.onAirDot} />
            <Text style={styles.onAirText}>ON AIR</Text>
          </View>
          <View style={styles.artEq}>
            <Equalizer active={isPlaying} size={14} />
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{channel.name}</Text>
          <Text style={styles.freq}>{channel.frequency}MHz</Text>

          <View style={styles.songBox}>
            <Ionicons name="musical-notes-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.songText} numberOfLines={1}>
              {error ?? '선곡 정보가 없어요'}
            </Text>
          </View>

          <View style={styles.controls}>
            <Pressable hitSlop={12} onPress={() => playPrev(true)}>
              <Ionicons name="play-skip-back" size={26} color="#FFFFFF" />
            </Pressable>
            <Pressable onPress={() => togglePlay()} style={styles.playButton}>
              {isBuffering ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="#FFFFFF" />
              )}
            </Pressable>
            <Pressable hitSlop={12} onPress={() => playNext(true)}>
              <Ionicons name="play-skip-forward" size={26} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.tabs}>
            {(
              [
                ['next', '이어지는 편성'],
                ['songs', '선곡표'],
              ] as const
            ).map(([key, label]) => (
              <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, tab === key && styles.tabActive]}>
                <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.tabBody}>
            {tab === 'next' ? (
              <Text style={styles.placeholder}>편성 정보는 백엔드가 연결되면 표시돼요.</Text>
            ) : (
              <>
                <Text style={styles.emptyTitle}>선곡 정보가 없어요</Text>
                <Text style={styles.placeholder}>곡이 재생되면 선곡 정보를 확인할 수 있어요</Text>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56 },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  artWrap: { alignSelf: 'center', marginTop: 16 },
  art: { borderRadius: radius.box },
  onAir: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.live,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  onAirDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFFFFF', marginRight: 4 },
  onAirText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  artEq: { position: 'absolute', right: 12, bottom: 12 },
  body: { flex: 1, paddingHorizontal: 20, marginTop: 28 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  freq: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  songBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.box,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 16,
  },
  songText: { color: colors.textSecondary, fontSize: 13, flex: 1 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 44,
    marginTop: 24,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: { flexDirection: 'row', marginTop: 28, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#FFFFFF' },
  tabText: { color: colors.textSecondary, fontSize: 14 },
  tabTextActive: { color: '#FFFFFF', fontWeight: '700' },
  tabBody: { alignItems: 'center', paddingTop: 28 },
  emptyTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 6 },
  placeholder: { color: colors.textSecondary, fontSize: 13, textAlign: 'center' },
  closeButton: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.surface },
  closeText: { color: '#FFFFFF' },
});
