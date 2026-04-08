# Server

`server`는 `ai-viewer`와 연결되는 AI 채팅 백엔드 모듈입니다.

## 개요

이 서버는 Express 기반 API 서버이며, 클라이언트에서 전달한 메시지를 Google Gemini 모델로 보내고 스트리밍 응답을 다시 반환합니다.

기본 실행 주소:

```text
http://localhost:3000
```

채팅 API:

```text
POST /api/chat
```

## 환경 변수

`.env` 파일에 아래 값을 설정합니다.

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
GEMINI_MODEL=gemini-2.5-flash
```

설명:

- `GOOGLE_GENERATIVE_AI_API_KEY`: Google Gemini API 키
- `GEMINI_MODEL`: 사용할 Gemini 모델명

지정하지 않으면 기본값으로 `gemini-2.0-flash`를 사용합니다.

## 스크립트

개발/실행:

```bash
npm run dev
```

또는:

```bash
npm run start
```

## 로컬 실행 순서

`ai-viewer` 또는 `container`에서 AI 채팅을 정상적으로 사용하려면 먼저 이 서버가 떠 있어야 합니다.

1. `server`에서 `npm run dev` 실행
2. `ai-viewer`에서 실행
3. 필요하면 `container`에서 remote로 연결

## 주의사항

- `.env`에 있는 API 키는 브라우저로 노출되면 안 되므로 서버에서만 사용해야 합니다.
- `.env` 파일은 Git에 올리지 않는 것을 권장합니다.
