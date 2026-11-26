---
description: ChatGPT(OpenAI 이미지 API)에 이미지 생성을 요청한다. 기본은 메가헤르츠 로고·앱 아이콘 시안.
argument-hint: "[만들 이미지 설명 — 비우면 MHz 로고 시안]"
---

ChatGPT(OpenAI 이미지 API)에 이미지를 요청해 줘.

1. 터미널 환경에 `OPENAI_API_KEY`가 있는지 `node -e "process.exit(process.env.OPENAI_API_KEY?0:1)"`로만 확인해. 값을 출력하거나 파일에 쓰지 마. 없으면 사용자에게 `export OPENAI_API_KEY=...`를 직접 실행해 달라고 하고 멈춰.
2. 요청 내용: $ARGUMENTS
   비어 있으면 아래 "기본 요청"을 써.
3. 프롬프트는 영어로 다듬고, `node scripts/chatgpt-image.mjs "<프롬프트>" assets/design/<알맞은-이름>.png 3` 으로 시안 3장을 만들어.
4. 만든 이미지를 열어 보고 시안별로 한 줄씩 평가한 뒤, 사용자가 고르면 `assets/icon.png`(1024, 배경 #0E0E12), `assets/splash-icon.png`(배경 투명), `assets/adaptive-icon.png`(가운데 66% 안전 영역)로 맞춰 교체해. 고르기 전에는 assets/의 기존 아이콘을 덮어쓰지 마.

## 기본 요청

메가헤르츠(MHz) 라디오 스트리밍 앱의 앱 아이콘 겸 로고 시안.
- 워드마크 "MHz"가 주인공. 굵은 산세리프, 흰색.
- 라디오 주파수·음파를 떠올리게 하는 파형 막대(전기 파랑 #4F5BFF) 를 워드마크와 자연스럽게 결합.
- 배경은 거의 검정 #0E0E12, 평평한 플랫 디자인, 그림자·그라데이션 과하지 않게.
- 작은 크기(앱 아이콘 60px)에서도 알아볼 수 있게 단순하게.
- 다른 회사 로고·캐릭터를 닮지 않은 독창적인 디자인. 글자는 "MHz" 외에 넣지 않기.
