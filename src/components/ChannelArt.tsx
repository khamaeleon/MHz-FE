import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Channel } from '../data/channels';
import { BROADCASTER_LABEL } from '../data/channels';

/**
 * 프로그램 썸네일 대신 쓰는 채널 아트워크.
 * 편성 데이터(썸네일)가 붙으면 이 자리에 이미지를 넣는다.
 */
export function ChannelArt({
  channel,
  size,
  style,
  compact = false,
}: {
  channel: Channel;
  size?: number;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}) {
  const scale = compact ? 0.45 : 1;
  return (
    <View style={[{ overflow: 'hidden' }, size ? { width: size, height: size } : null, style]}>
      <LinearGradient
        colors={channel.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.center}>
        {!compact && (
          <Text style={[styles.broadcaster, { fontSize: 13 * scale }]}>
            {BROADCASTER_LABEL[channel.broadcaster]}
          </Text>
        )}
        <Text
          style={[styles.short, { fontSize: 26 * scale }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {channel.shortName}
        </Text>
        {!compact && <Text style={styles.freq}>{channel.frequency}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  broadcaster: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: 1 },
  short: { color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.5 },
  freq: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: '600', marginTop: 2 },
});
