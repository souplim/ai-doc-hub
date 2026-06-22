# AI-Powered Documentation Hub

사용자가 업로드한 문서를 AI가 분석하고, 이를 바탕으로 실시간 대화(RAG)를 나눌 수 있는 **마이크로 프런트엔드(MFE)** 기반 채팅 프로젝트입니다.

## Key Features

- **통합 채팅 UI:** 파일 드래그 앤 드롭 또는 첨부 버튼으로 파일을 채팅창에 바로 첨부. 별도 업로더 없이 하나의 인터페이스에서 파일 첨부 + 질문 전송이 가능합니다.
- **Real-time AI Streaming:** Vercel AI SDK와 Gemini API를 활용한 자연스러운 타이핑 효과의 챗 UI.
- **RAG (Retrieval-Augmented Generation):** 첨부된 문서의 문맥을 파악해 정확한 정보를 제공하는 AI 답변 시스템. PDF, TXT, MD 파일의 텍스트를 추출하여 AI 프롬프트에 자동 주입합니다.
- **Micro Frontend Architecture:** Module Federation을 이용해 독립적으로 빌드 및 배포되는 컨테이너화된 구조.

## Architecture

```
container (Host, :5000)
└── aiViewer (Remote, :5002)   ← 파일 첨부 + 채팅 통합 UI
server (Backend, :3000)        ← Gemini 스트리밍 API
```

| 모듈 | 역할 |
|------|------|
| **Container** | 레이아웃, 인증(Google OAuth), AI Viewer 원격 로드 |
| **AI Viewer** | 파일 첨부(드래그·버튼), 텍스트 추출, 스트리밍 채팅 |
| **Server** | documentContext를 Gemini 시스템 프롬프트에 주입, SSE 스트리밍 |

> `uploader` 디렉토리는 독립 실행형 업로더 컴포넌트(port 5001)로 남아있습니다. 현재 Container에서는 사용하지 않으며 별도 레퍼런스용으로 참고할 수 있습니다.

## Tech Stack

### Frontend

| 분류 | 기술 |
|------|------|
| Framework | React 19, TypeScript |
| Build | Vite, Module Federation (`@originjs/vite-plugin-federation`) |
| Styling | Tailwind CSS 4, Vanilla CSS |
| AI Integration | Vercel AI SDK (`@ai-sdk/react`, `ai`) |
| PDF 파싱 | pdfjs-dist |
| Form | React Hook Form, Zod |

### Backend

| 분류 | 기술 |
|------|------|
| Runtime | Node.js, Express 5 |
| AI Model | Google Gemini 2.0 Flash (`@ai-sdk/google`) |
| Streaming | Server-Sent Events (SSE) via `streamText` |
| 인증 | Google OAuth 2.0 (Passport.js) |

## Getting Started

### 1. 저장소 클론

```bash
git clone https://github.com/souplim/ai-doc-hub.git
```

### 2. 환경 변수 설정

`server/.env` 파일을 생성하고 아래 키를 설정합니다.

```env
GOOGLE_GENERATION_AI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
SESSION_SECRET=your_session_secret
```

> `.env.example` 파일을 참고하세요.

### 3. 실행

> **주의:** Module Federation 구조상 Remote 앱(`ai-viewer`)은 반드시 `dev:remote`로 실행해야 합니다.
> `npm run dev`(standalone)로 실행하면 Container가 `/assets/remoteEntry.js`를 찾지 못해 404가 발생합니다.

터미널 3개를 열고 아래 순서대로 실행합니다.

**터미널 1 — AI Viewer (Remote, port 5002)**
```bash
cd ai-viewer
npm install
npm run dev:remote
```

**터미널 2 — Container (Host, port 5000)**
```bash
cd container
npm install
npm run dev
```

**터미널 3 — Server (Backend, port 3000)**
```bash
cd server
npm install
npm run dev
```

> `dev:remote`는 내부적으로 `build:watch`와 `vite preview`를 함께 실행합니다.
> Remote 앱 빌드가 완료된 후 Container를 시작해야 정상 동작합니다.

### 사용 방법

1. `http://localhost:5000` 접속 후 Google 로그인
2. 채팅창에 파일을 **드래그 앤 드롭** 하거나 **📎 버튼**으로 첨부
   - 지원 형식: PDF, TXT, MD, JPG, PNG, WEBP, GIF, DOC, DOCX
   - 여러 파일 동시 첨부 가능, X 버튼으로 개별 제거
3. 질문을 입력하고 **전송** — AI가 첨부 파일 내용을 기반으로 답변
