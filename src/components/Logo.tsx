import { Text, View } from 'react-native';

import { colors } from '../theme';

const BAR_HEIGHTS = [0.35, 0.7, 1, 0.55, 0.85, 0.45];

/** 파형 막대 마크 */
export function WaveMark({ size = 20, color = colors.primary }: { size?: number; color?: string }) {
  const barWidth = Math.max(2, Math.round(size / 8));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: size, gap: barWidth * 0.6 }}>
      {BAR_HEIGHTS.map((h, i) => (
        <View
          key={i}
          style={{ width: barWidth, height: size * h, borderRadius: barWidth, backgroundColor: color }}
        />
      ))}
    </View>
  );
}

/** 파형 마크 + MHz 워드마크 */
export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <WaveMark size={size} />
      <Text
        style={{
          marginLeft: size * 0.3,
          fontSize: size,
          fontWeight: '800',
          color: colors.text,
          letterSpacing: -0.5,
        }}
      >
        MHz
      </Text>
    </View>
  );
}
