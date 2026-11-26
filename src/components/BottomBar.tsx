import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius } from '../theme';
import { MiniPlayer } from './MiniPlayer';

const TABS: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  index: { label: 'LIVE', icon: 'radio-outline' },
  schedule: { label: '편성', icon: 'calendar-outline' },
  my: { label: '마이', icon: 'person-outline' },
};

/** 화면 위에 떠 있는 미니 플레이어 + 캡슐형 탭바 */
export function BottomBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <MiniPlayer />
      <BlurView intensity={40} tint="dark" style={styles.bar}>
        {state.routes.map((route, index) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable key={route.key} onPress={onPress} style={[styles.item, focused && styles.itemActive]}>
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
  wrap: { position: 'absolute', left: 16, right: 16, bottom: 0 },
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

/** 스크롤 화면 맨 아래가 미니 플레이어·탭바에 가리지 않도록 주는 여백 */
export const BOTTOM_BAR_SPACE = 190;
