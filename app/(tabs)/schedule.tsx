import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChannelArt } from '../../src/components/ChannelArt';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { CHANNELS } from '../../src/data/channels';
import { usePlayerStore } from '../../src/store/player';
import { colors, radius } from '../../src/theme';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * 편성 탭 (P1). 채널·날짜 선택 UI만 먼저 만들고,
 * 시간대별 프로그램 목록은 백엔드(GET /schedule)가 붙으면 채운다.
 */
export default function ScheduleScreen() {
  const currentId = usePlayerStore((s) => s.currentId);
  const [channelId, setChannelId] = useState(currentId ?? CHANNELS[0].id);
  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => [-2, -1, 0, 1, 2].map((n) => addDays(today, n)), [today]);
  const [dayIndex, setDayIndex] = useState(2);

  const now = new Date();
  const nowLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScreenHeader title={`${today.getFullYear()}년 ${today.getMonth() + 1}월`} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.channels}>
        {CHANNELS.map((c) => {
          const selected = c.id === channelId;
          return (
            <Pressable key={c.id} onPress={() => setChannelId(c.id)} style={[styles.logo, selected && styles.logoSelected]}>
              <ChannelArt channel={c} compact style={styles.logoArt} />
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.days}>
        <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        {days.map((d, i) => {
          const selected = i === dayIndex;
          const sunday = d.getDay() === 0;
          return (
            <Pressable key={i} onPress={() => setDayIndex(i)} style={[styles.day, selected && styles.daySelected]}>
              <Text style={[styles.weekday, sunday && !selected && { color: colors.live }, selected && styles.white]}>
                {WEEKDAYS[d.getDay()]}
              </Text>
              <Text style={[styles.date, selected && styles.white]}>{d.getDate()}</Text>
            </Pressable>
          );
        })}
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </View>

      <View style={styles.nowRow}>
        <Text style={styles.nowText}>현재 {nowLabel}</Text>
        <View style={styles.nowLine} />
      </View>

      <View style={styles.empty}>
        <Ionicons name="calendar-outline" size={28} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>편성표를 준비하고 있어요</Text>
        <Text style={styles.emptyBody}>백엔드가 연결되면 시간대별 프로그램이 여기에 표시돼요.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  channels: { paddingHorizontal: 16, gap: 10, paddingVertical: 8 },
  logo: { width: 56, height: 56, borderRadius: 28, padding: 3, borderWidth: 2, borderColor: 'transparent' },
  logoSelected: { borderColor: colors.primary },
  logoArt: { flex: 1, borderRadius: 25 },
  days: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  day: { width: 48, paddingVertical: 8, borderRadius: radius.box, alignItems: 'center' },
  daySelected: { backgroundColor: colors.primary },
  weekday: { color: colors.textSecondary, fontSize: 12 },
  date: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 4 },
  white: { color: '#FFFFFF' },
  nowRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 4 },
  nowText: { color: colors.live, fontSize: 11, fontWeight: '700', marginRight: 8 },
  nowLine: { flex: 1, height: 1, backgroundColor: colors.live },
  empty: { alignItems: 'center', paddingTop: 64, paddingHorizontal: 32 },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 12 },
  emptyBody: { color: colors.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'center' },
});
