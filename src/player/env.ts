import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * Expo Go 앱에서 실행 중인지.
 * Expo Go에는 react-native-track-player 네이티브 모듈이 없어서,
 * 이때는 화면 확인용으로 expo-audio 엔진을 쓴다(백그라운드·잠금화면 제어 없음).
 */
export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
