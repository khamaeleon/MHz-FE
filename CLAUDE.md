# 메가헤르츠(MHz) — Frontend

KBS·MBC·SBS 라디오를 한 앱에서 듣는 React Native(Expo) 앱. 레퍼런스 앱은 modio(화면 구성·흐름만 참고, 이름·로고·디자인은 독자적으로).

- 기획서: https://claude.ai/artifact/X23WWAswXHuJ1cTNDRHcHt (화면 명세, API, DB, 로드맵, 미결 사항)
- 백엔드: https://github.com/khamaeleon/MHz-BE (Node.js API + PostgreSQL, docker-compose로 배포됨. Supabase는 쓰지 않음)
- 사용자는 한국어로 소통한다. 답변·커밋 메시지·주석은 한국어.

## 작업 규칙

- 이미지 생성처럼 ChatGPT가 맡는 게 적절한 작업은 ChatGPT(OpenAI API)에 넘긴다: `/chatgpt-image` 명령 또는 `node scripts/chatgpt-image.mjs` 사용. API 키는 사용자의 환경변수 `OPENAI_API_KEY`로만 쓰고, 파일·커밋에 절대 넣지 않는다.
- 오디오는 `src/player/engine.ts`(엔진 선택)를 통해서만 다룬다. 개발 빌드는 `engine.trackplayer.ts`(react-native-track-player), Expo Go는 `engine.expoaudio.ts`(expo-audio, 확인용). track-player 는 이 두 곳과 `service.ts`, `index.js`의 조건부 require 외에는 import 하지 않는다(Expo Go 에서 앱이 죽음).
- 파일명에 `.native` `.ios` `.android` `.web` 을 붙이지 않는다. Metro 가 플랫폼 전용 파일로 인식해 `import './x'` 가 엉뚱한 파일로 연결된다.
- 방송사 스트림 URL은 만료되므로 캐시하지 말고 재생할 때마다 `src/api/stream.ts`로 새로 받는다.
- 즐겨찾기·설정은 기기 저장(`src/store/prefs.ts`). MVP에는 로그인이 없다.

## 실행

```bash
bash scripts/bootstrap.sh   # 처음 한 번 (package.json 없을 때)
npx expo run:ios --device   # 개발 빌드 (백그라운드·잠금화면 포함)
npm run go                  # Expo Go 확인 모드 (백그라운드·잠금화면 없음)
```

## 현재 상태 (2026-11-26 저녁)

- 완료: LIVE 그리드, 미니/풀스크린 플레이어, 백그라운드 재생·잠금화면 제어(개발 빌드), 즐겨찾기, 마이페이지 설정, 편성 탭 UI, MHz 아이콘(코드로 만든 임시 워드마크), Expo Go 확인 모드
- Expo SDK 58. 사용자는 아이폰 + Expo Go(`npx expo start --go --clear`)로 확인 중
- 오늘 고친 것: `.native` 파일명 충돌, 탭바 navigation undefined(→ expo-router 주소 기반 이동), 하단 바 겹침(절대 위치 → 일반 배치), 플레이어 상태바 겹침(모달 → 일반 화면 + 안전 영역 직접 적용)
- 아직 확인 못 함: 8개 채널 실제 재생 여부, 개발 빌드에서 백그라운드·잠금화면
- 다음: 채널 재생 확인 → ChatGPT로 로고 다듬기(/chatgpt-image) → API 도메인·HTTPS 붙인 뒤 `/channels`·`/channels/:id/now` 연결 → 검색·프로그램 상세(P1)

## 채널 스트림 API (출처: https://blog.bsod.kr/137)

- KBS: `https://cfpwwwapi.kbs.co.kr/api/v1/landing/live/channel_code/{21|22|24|25}` → JSON의 `service_url` (필드 위치는 실제 응답으로 확인 필요)
- MBC: `https://sminiplay.imbc.com/aacplay.ashx?agent=webapp&channel={sfm|mfm}` → 본문이 m3u8 URL
- SBS: `https://apis.sbs.co.kr/play-api/1.0/livestream/{lovepc/lovefm|powerpc/powerfm}?protocol=hls&ssl=Y` → 본문이 m3u8 URL
- EBS FM: 미정
