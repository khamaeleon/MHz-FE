import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

/** 재생 중 표시용 막대 애니메이션 */
export function Equalizer({
  active,
  color = '#FFFFFF',
  size = 14,
}: {
  active: boolean;
  color?: string;
  size?: number;
}) {
  const bars = useRef([0, 1, 2, 3].map(() => new Animated.Value(0.4))).current;

  useEffect(() => {
    if (!active) {
      bars.forEach((b) => b.setValue(0.4));
      return;
    }
    const loops = bars.map((b, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(b, { toValue: 1, duration: 280 + i * 90, useNativeDriver: true }),
          Animated.timing(b, { toValue: 0.25, duration: 280 + i * 90, useNativeDriver: true }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [active, bars]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: size, gap: 2 }}>
      {bars.map((b, i) => (
        <Animated.View
          key={i}
          style={{
            width: 3,
            height: size,
            borderRadius: 1.5,
            backgroundColor: color,
            transform: [{ scaleY: b }],
          }}
        />
      ))}
    </View>
  );
}
