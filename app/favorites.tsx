import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChannelArt } from '../src/components/ChannelArt';
import { CHANNELS } from '../src/data/channels';
import { playChannelById } from '../src/player/controller';
import { usePlayerStore } from '../src/store/player';
import { usePrefs } from '../src/store/prefs';
import { colors } from '../src/theme';

export default function FavoritesScreen() {
  const favorites = usePrefs((s) => s.favorites);
  const toggleFavorite = usePrefs((s) => s.toggleFavorite);
  const currentId = usePlayerStore((s) => s.currentId);
  const channels = favorites
    .map((id) => CHANNELS.find((c) => c.id === id))
    .filter((c): c is (typeof CHANNELS)[number] => Boolean(c));

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>즐겨찾기</Text>
      </View>

      <FlatList
        data={channels}
        keyExtractor={(c) => c.id}
        ListEmptyComponent={
          <Text style={styles.empty}>LIVE 화면에서 별을 눌러 즐겨찾기를 추가해 보세요.</Text>
        }
        renderItem={({ item }) => {
          const current = item.id === currentId;
          return (
            <Pressable onPress={() => playChannelById(item.id, { fromUser: true })} style={styles.row}>
              <ChannelArt channel={item} compact style={[styles.logo, current && styles.logoCurrent]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, current && { color: colors.primary }]}>{item.name}</Text>
                <View style={styles.subRow}>
                  <View style={styles.dot} />
                  <Text style={styles.sub}>{item.frequency}MHz 라이브</Text>
                </View>
              </View>
              <Pressable hitSlop={10} onPress={() => toggleFavorite(item.id)}>
                <Ionicons name="star" size={18} color={colors.primary} />
              </Pressable>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 52, gap: 8 },
  title: { color: colors.text, fontSize: 17, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 12 },
  logo: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'transparent' },
  logoCurrent: { borderColor: colors.primary },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  subRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.live, marginRight: 5 },
  sub: { color: colors.textSecondary, fontSize: 12 },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 64, paddingHorizontal: 32 },
});
