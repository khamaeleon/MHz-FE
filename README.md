# 메가헤르츠 (MHz) — Frontend

KBS·MBC·SBS 라디오 8개 채널을 한 앱에서 듣는 React Native(Expo) 앱입니다. 백엔드(API)는 [MHz-BE](https://github.com/khamaeleon/MHz-BE)에 있어요.

## 처음 설정 (맥에서 한 번만)

준비물: Node.js, Xcode(시뮬레이터 포함). 아이폰 실기기로 테스트하려면 Xcode에 Apple ID 로그인.

```bash
git clone https://github.com/khamaeleon/MHz-FE.git
cd MHz-FE
bash scripts/bootstrap.sh     # 현재 Expo SDK에 맞춰 package.json 생성 + 라이브러리 설치
npx expo run:ios              # 시뮬레이터 실행 (첫 빌드는 몇 분 걸려요)
npx expo run:ios --device     # 연결된 아이폰에서 실행
```

`bootstrap.sh`가 만든 `package.json`, `package-lock.json`은 커밋해 두세요. 그 다음부터는 `npm install`만 하면 됩니다.

> 오디오 라이브러리(react-native-track-player)는 네이티브 모듈이라 **Expo Go 앱에서는 동작하지 않아요.** 꼭 `npx expo run:ios`(개발 빌드)로 실행하세요.

## 1단계 재생 검증 체크리스트

- [ ] 8개 채널 각각 카드를 눌러 재생되는지 (KBS 4, MBC 2, SBS 2)
- [ ] 화면을 끄고 30분 이상 끊김 없이 재생되는지 (실기기)
- [ ] 잠금화면·제어센터에 채널명과 재생/이전/다음 버튼이 나오는지
- [ ] 이어폰을 빼면 멈추는지
- [ ] 앱을 다시 열면 마지막 채널이 자동 재생되는지

재생이 안 되는 채널이 있으면 Metro 터미널에 뜨는 오류 문구와 함께 알려주세요. 방송사 API 응답 형식이 블로그와 다를 수 있어서 `src/api/stream.ts`만 고치면 됩니다.

## 폴더 구조

```
index.js                 # 앱 시작 + 백그라운드 재생 서비스 등록
app/
  _layout.tsx            # 스플래시, 플레이어 초기화, 자동 재생
  (tabs)/_layout.tsx     # 탭 3개 + 미니 플레이어
  (tabs)/index.tsx       # LIVE (모든 채널)
  (tabs)/schedule.tsx    # 편성 (UI만, 데이터는 백엔드 연결 후)
  (tabs)/my.tsx          # 마이페이지 (설정)
  player.tsx             # 풀스크린 플레이어
  favorites.tsx          # 즐겨찾기 목록
src/
  data/channels.ts       # 채널 목록 (주파수, 색, 방송사 API 정보)
  api/stream.ts          # 방송사별 스트림 URL 받아오기 (KBS/MBC/SBS)
  player/engine.ts       # react-native-track-player 감싸기 (라이브러리 교체 시 이 파일만)
  player/controller.ts   # 재생·일시정지·채널 이동·오류 시 1회 재시도
  player/service.ts      # 잠금화면·이어폰 버튼 처리
  store/prefs.ts         # 즐겨찾기·최근 채널·설정 (기기에 저장)
  store/player.ts        # 현재 채널, 로딩, 오류
  components/            # 채널 카드, 미니 플레이어, 탭바, 로고 등
  theme.ts               # 색·글자 크기
assets/                  # MHz 아이콘, 스플래시
scripts/bootstrap.sh     # 처음 설정용
```

## 출시 전에 바꿀 것

- `app.json`의 `bundleIdentifier`, `package` (`com.yourname.mhz` → 본인 것)
- `app/(tabs)/my.tsx`의 `SUPPORT_EMAIL`

## 아직 없는 것 (기획서 P1)

편성표·선곡표·현재 프로그램명(백엔드 필요), 검색, 프로그램 상세, 큰 글씨 모드, 차량 연결, EBS FM.
