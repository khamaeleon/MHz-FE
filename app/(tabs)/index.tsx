import { useMemo } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BOTTOM_BAR_SPACE } from '../../src/components/BottomBar';
import { ChannelCard } from '../../src/components/ChannelCard';
import { WaveMark } from '../../src/components/Logo';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { CHANNELS, type Channel } from '../../src/data/channels';
import { usePrefs } from '../../src/store/prefs';
import { colors } from '../../src/theme';

/** 최근 들은 채널 → 즐겨찾기 → 나머지 순서 */
function orderChannels(lastId: string | undefined, favorites: string[]): Channel[] {
  const rank = (c: Channel) => (c.id === lastId ? 0 : favorites.includes(c.id) ? 1 : 2);
  return [...CHANNELS].sort((a, b) => rank(a) - rank(b));
}

export default function LiveScreen() {
  const favorites = usePrefs((s) => s.favorites);
  const lastId = usePrefs((s) => s.recentChannels[0]);
  const channels = useMemo(() => orderChannels(lastId, favorites), [lastId, favorites]);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScreenHeader
        title="모든 채널"
        left={<WaveMark size={20} />}
        actions={[
          {
            icon: 'help-circle-outline',
            onPress: () => Alert.alert('메가헤르츠', '카드를 누르면 바로 재생돼요. 별을 누르면 즐겨찾기에 추가돼요.'),
          },
          { icon: 'search', onPress: () => Alert.alert('검색', '검색은 준비 중이에요.') },
        ]}
      />
      <FlatList
        data={channels}
        keyExtractor={(c) => c.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ChannelCard channel={item} recent={item.id === lastId} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: BOTTOM_BAR_SPACE, gap: 12 },
  column: { gap: 12 },
});
