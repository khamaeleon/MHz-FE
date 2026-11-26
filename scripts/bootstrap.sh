#!/usr/bin/env bash
# 처음 한 번만 실행: 현재 Expo SDK에 맞는 package.json을 만들고 라이브러리를 설치한다.
# 실행 후 생긴 package.json / package-lock.json 은 커밋해 두면 다음부터는 npm install 만 하면 된다.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -f package.json ]; then
  echo "package.json이 이미 있어요. 'npm install' 만 실행하세요."
  exit 0
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "1/3 최신 Expo 템플릿에서 package.json 가져오는 중"
npx --yes create-expo-app@latest "$TMP/app" --yes --no-install
cp "$TMP/app/package.json" .
npm pkg set name=mhz-fe main=index.js
npm pkg delete scripts.reset-project || true
npm pkg set scripts.go="expo start --go" scripts.ios:dev="expo run:ios" scripts.android:dev="expo run:android"

echo "2/3 기본 라이브러리 설치"
npm install

echo "3/3 메가헤르츠에 필요한 라이브러리 설치 (SDK에 맞는 버전으로)"
npx expo install \
  expo-router expo-splash-screen expo-status-bar expo-constants expo-linking \
  expo-linear-gradient expo-blur expo-dev-client expo-audio \
  react-native-safe-area-context react-native-screens \
  react-native-gesture-handler react-native-reanimated \
  @react-navigation/bottom-tabs @expo/vector-icons \
  @react-native-async-storage/async-storage @react-native-community/netinfo
npm install zustand react-native-track-player

echo ""
echo "완료! 실행: npx expo run:ios   (실기기: npx expo run:ios --device)"
echo "package.json, package-lock.json 을 커밋해 두세요."
