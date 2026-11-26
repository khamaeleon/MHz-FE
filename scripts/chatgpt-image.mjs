#!/usr/bin/env node
// ChatGPT(OpenAI 이미지 API)로 이미지를 만들어 PNG로 저장한다.
//
// 사용법:
//   export OPENAI_API_KEY=...            # 키는 환경변수로만. 파일·커밋에 넣지 말 것
//   node scripts/chatgpt-image.mjs "프롬프트" assets/design/logo-1.png [개수]
//
// 모델은 OPENAI_IMAGE_MODEL 환경변수로 바꿀 수 있다 (기본: gpt-image-1).

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname } from 'node:path';

const [prompt, outPath = 'assets/design/image.png', countArg = '1'] = process.argv.slice(2);
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-1';
const n = Math.min(Math.max(Number(countArg) || 1, 1), 4);

if (!prompt) {
  console.error('사용법: node scripts/chatgpt-image.mjs "프롬프트" <저장 경로.png> [개수 1~4]');
  process.exit(1);
}
if (!apiKey) {
  console.error('OPENAI_API_KEY 환경변수가 없어요. 터미널에서 export OPENAI_API_KEY=... 후 다시 실행하세요.');
  process.exit(1);
}

const res = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
  body: JSON.stringify({ model, prompt, n, size: '1024x1024' }),
});

const body = await res.json();
if (!res.ok) {
  console.error(`OpenAI 오류 (HTTP ${res.status}):`, body?.error?.message ?? body);
  process.exit(1);
}

await mkdir(dirname(outPath), { recursive: true });
const ext = extname(outPath) || '.png';
const base = outPath.slice(0, outPath.length - ext.length);

const saved = [];
for (const [i, item] of body.data.entries()) {
  const file = n === 1 ? `${base}${ext}` : `${base}-${i + 1}${ext}`;
  if (item.b64_json) {
    await writeFile(file, Buffer.from(item.b64_json, 'base64'));
  } else if (item.url) {
    const img = await fetch(item.url);
    await writeFile(file, Buffer.from(await img.arrayBuffer()));
  } else {
    continue;
  }
  saved.push(file);
}

console.log(`저장 완료 (${model}):\n${saved.map((f) => `  ${f}`).join('\n')}`);
