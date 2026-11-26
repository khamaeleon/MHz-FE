import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BOTTOM_BAR_SPACE } from '../../src/components/BottomBar';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { usePrefs, type Settings } from '../../src/store/prefs';
import { colors, radius } from '../../src/theme';

const SUPPORT_EMAIL = 'support@example.com'; // TODO: 실제 고객센터 주소로 변경

const soon = (title: string) => () => Alert.alert(title, '준비 중이에요.');

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ToggleRow({ setting, label, description }: { setting: keyof Settings; label: string; description?: string }) {
  const value = usePrefs((s) => s.settings[setting]);
  const setSetting = usePrefs((s) => s.setSetting);
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={(v) => setSetting(setting, v)}
        trackColor={{ true: colors.primary, false: colors.surface2 }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function LinkRow({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.row}>
      <Text style={[styles.label, { flex: 1 }]}>{label}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {onPress ? <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} /> : null}
    </Pressable>
  );
}

export default function MyScreen() {
  const favoriteCount = usePrefs((s) => s.favorites.length);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScreenHeader
        title="마이페이지"
        actions={[{ icon: 'help-circle-outline', onPress: soon('도움말') }]}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: BOTTOM_BAR_SPACE }}>
        <Pressable onPress={() => router.push('/favorites')} style={styles.favorites}>
          <Text style={styles.label}>
            즐겨찾기 <Text style={{ color: colors.primary }}>{favoriteCount}</Text>
          </Text>
        </Pressable>

        <Section title="재생">
          <ToggleRow setting="cellular" label="셀룰러 데이터로 재생" description="Wi-Fi가 아닐 때 모바일 데이터를 사용해요" />
          <ToggleRow setting="autoplay" label="자동 재생" description="앱을 열면 마지막으로 들은 채널을 바로 재생해요" />
        </Section>

        <Section title="디스플레이">
          <LinkRow label="테마" value="다크" />
          <ToggleRow setting="largeText" label="큰 글씨 모드" description="준비 중이에요" />
        </Section>

        <Section title="연결">
          <LinkRow label="차량 연결" value="연결 안 됨" onPress={soon('차량 연결')} />
        </Section>

        <Section title="지원">
          <LinkRow label="공지사항" onPress={soon('공지사항')} />
          <LinkRow label="FAQ" onPress={soon('FAQ')} />
          <LinkRow label="1:1 문의" onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} />
          <LinkRow label="약관 및 정책" onPress={soon('약관 및 정책')} />
          <LinkRow label="앱 버전" value={Constants.expoConfig?.version ?? '-'} />
        </Section>

        <Text style={styles.footer}>고객센터 {SUPPORT_EMAIL}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  favorites: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.box,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { color: colors.textSecondary, fontSize: 12, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, minHeight: 48 },
  label: { color: colors.text, fontSize: 15 },
  description: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  value: { color: colors.textSecondary, fontSize: 13, marginRight: 6 },
  footer: { color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 24 },
});
