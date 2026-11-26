import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font } from '../theme';

export function ScreenHeader({
  title,
  left,
  actions = [],
}: {
  title: string;
  left?: ReactNode;
  actions?: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void }[];
}) {
  return (
    <View style={styles.wrap}>
      {left}
      <Text style={styles.title}>{title}</Text>
      <View style={{ flex: 1 }} />
      {actions.map((a) => (
        <Pressable key={a.icon} hitSlop={8} onPress={a.onPress} style={styles.action}>
          <Ionicons name={a.icon} size={22} color={colors.text} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 52 },
  title: { color: colors.text, fontSize: font.title, fontWeight: '700', marginLeft: 8 },
  action: { marginLeft: 16 },
});
