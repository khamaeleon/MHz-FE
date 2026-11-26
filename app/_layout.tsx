import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { playChannelById } from '../src/player/controller';
import { setupPlayer } from '../src/player/engine';
import { usePrefs, waitForPrefs } from '../src/store/prefs';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await waitForPrefs();
      try {
        await setupPlayer();
      } catch (e) {
        console.warn('플레이어 초기화 실패', e);
      }
      setReady(true);
      await SplashScreen.hideAsync();

      // 자동 재생: 마지막으로 들은 채널을 바로 재생
      const { settings, lastChannelId } = usePrefs.getState();
      if (settings.autoplay && lastChannelId) playChannelById(lastChannelId);
    })();
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="player"
            options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="favorites" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
