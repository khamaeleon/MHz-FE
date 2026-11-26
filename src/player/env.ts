import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * Expo Go 앱에서 실행 중인지.
 * Expo Go에는 react-native-track-player 네이티브 모듈이 없어서,
 * 이때는 화면 확인용으로 expo-audio 엔진을 쓴다(백그라운드·잠금화면 제어 없음).
 */
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  // 구버전 호환: appOwnership 은 Expo Go 에서 'expo'
  (Constants as { appOwnership?: string | null }).appOwnership === 'expo';

console.log(
  `[MHz] 실행 환경: ${String(Constants.executionEnvironment)} → ${isExpoGo ? 'Expo Go 확인 모드' : '개발 빌드/실제 앱'}`,
);
