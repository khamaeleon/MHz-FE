# 메가헤르츠(MHz) — Frontend

KBS·MBC·SBS 라디오를 한 앱에서 듣는 React Native(Expo) 앱. 레퍼런스 앱은 modio(화면 구성·흐름만 참고, 이름·로고·디자인은 독자적으로).

- 기획서: https://claude.ai/artifact/X23WWAswXHuJ1cTNDRHcHt (화면 명세, API, DB, 로드맵, 미결 사항)
- 백엔드: https://github.com/khamaeleon/MHz-BE (Supabase)
- 사용자는 한국어로 소통한다. 답변·커밋 메시지·주석은 한국어.

## 작업 규칙

- 이미지 생성처럼 ChatGPT가 맡는 게 적절한 작업은 ChatGPT(OpenAI API)에 넘긴다: `/chatgpt-image` 명령 또는 `node scripts/chatgpt-image.mjs` 사용. API 키는 사용자의 환경변수 `OPENAI_API_KEY`로만 쓰고, 파일·커밋에 절대 넣지 않는다.
- 오디오는 `src/player/engine.ts`(엔진 선택)를 통해서만 다룬다. 개발 빌드는 `engine.native.ts`(react-native-track-player), Expo Go는 `engine.expo-go.ts`(expo-audio, 확인용). track-player 는 이 두 곳과 `service.ts`, `index.js`의 조건부 require 외에는 import 하지 않는다(Expo Go 에서 앱이 죽음).
- 방송사 스트림 URL은 만료되므로 캐시하지 말고 재생할 때마다 `src/api/stream.ts`로 새로 받는다.
- 즐겨찾기·설정은 기기 저장(`src/store/prefs.ts`). MVP에는 로그인이 없다.

## 실행

```bash
bash scripts/bootstrap.sh   # 처음 한 번 (package.json 없을 때)
npx expo run:ios --device   # 개발 빌드 (백그라운드·잠금화면 포함)
npm run go                  # Expo Go 확인 모드 (백그라운드·잠금화면 없음)
```

## 현재 상태 (2026-11-26)

- 완료: LIVE 그리드, 미니/풀스크린 플레이어, 백그라운드 재생·잠금화면 제어, 즐겨찾기, 마이페이지 설정, 편성 탭 UI, MHz 아이콘(코드로 만든 임시 워드마크)
- 아직 실기기 빌드·재생 검증을 못 했다 → README의 "1단계 재생 검증 체크리스트"부터
- 다음: ChatGPT로 로고·아이콘 다듬기, 백엔드 `/channels`·`/channels/:id/now` 연결, 검색·프로그램 상세(P1)

## 채널 스트림 API (출처: https://blog.bsod.kr/137)

- KBS: `https://cfpwwwapi.kbs.co.kr/api/v1/landing/live/channel_code/{21|22|24|25}` → JSON의 `service_url` (필드 위치는 실제 응답으로 확인 필요)
- MBC: `https://sminiplay.imbc.com/aacplay.ashx?agent=webapp&channel={sfm|mfm}` → 본문이 m3u8 URL
- SBS: `https://apis.sbs.co.kr/play-api/1.0/livestream/{lovepc/lovefm|powerpc/powerfm}?protocol=hls&ssl=Y` → 본문이 m3u8 URL
- EBS FM: 미정
