import { Ionicons } from '@expo/vector-icons';
import { router, usePathname, type Href } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius } from '../theme';
import { MiniPlayer } from './MiniPlayer';

/**
 * 탭 이동은 탭바 props(navigation 등)에 기대지 않고 expo-router 주소로 처리한다.
 * (SDK 버전에 따라 tabBar 에 넘어오는 props 가 달라 navigation 이 비어 있는 경우가 있었음)
 */
const TABS: { href: Href; path: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { href: '/', path: '/', label: 'LIVE', icon: 'radio-outline' },
  { href: '/schedule', path: '/schedule', label: '편성', icon: 'calendar-outline' },
  { href: '/my', path: '/my', label: '마이', icon: 'person-outline' },
];

/** 화면 위에 떠 있는 미니 플레이어 + 캡슐형 탭바 */
export function BottomBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <MiniPlayer />
      <BlurView intensity={40} tint="dark" style={styles.bar}>
        {TABS.map((tab) => {
          const focused = pathname === tab.path;
          return (
            <Pressable
              key={tab.path}
              onPress={() => {
                if (!focused) router.navigate(tab.href);
              }}
              style={[styles.item, focused && styles.itemActive]}
            >
              <Ionicons name={tab.icon} size={20} color={focused ? '#FFFFFF' : colors.textSecondary} />
              <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  // 절대 위치로 띄우면 iOS 에서 탭바 영역 밖 터치가 먹히지 않고 화면 버튼을 가려서,
  // 탭바가 자기 높이를 차지하는 일반 배치로 둔다 (화면은 그 위까지만 그려짐)
  wrap: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: colors.bg },
  bar: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    overflow: 'hidden',
    padding: 6,
    backgroundColor: 'rgba(28,28,34,0.85)',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  itemActive: { backgroundColor: colors.primary },
  label: { color: colors.textSecondary, fontSize: 10, marginTop: 2 },
  labelActive: { color: '#FFFFFF', fontWeight: '700' },
});

/** 스크롤 화면 맨 아래 여백 (탭바가 자리를 차지하므로 약간만) */
export const BOTTOM_BAR_SPACE = 24;
