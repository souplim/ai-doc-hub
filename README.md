# 🏗️ AI-Powered Documentation Hub

사용자가 업로드한 문서를 AI가 분석하고, 이를 바탕으로 실시간 대화(RAG)를 나눌 수 있는 **마이크로 프런트엔드(MFE)** 기반의 대시보드 프로젝트입니다.

## 🌟 Key Features

- **Micro Frontend Architecture:** Module Federation을 이용해 독립적으로 빌드 및 배포되는 컨테이너화된 구조.
- **Real-time AI Streaming:** Vercel AI SDK와 Gemini API를 활용한 자연스러운 타이핑 효과의 챗 UI.
- **RAG (Retrieval-Augmented Generation):** 업로드된 문서의 문맥을 파악하여 정확한 정보를 제공하는 AI 답변 시스템.
- **No-Library UI:** 라이브러리 의존성 없이 React와 순수 CSS만으로 구현한 고성능 드래그 앤 드롭 업로더.

## 🏗️ Architecture

본 프로젝트는 확장성과 유지보수성을 위해 세 개의 마이크로 앱으로 분리되어 있습니다.

1.  **Container (Host):** 메인 레이아웃 및 인증, 마이크로 앱 간의 상태 관리 및 이벤트 중계.
2.  **Uploader (Remote):** 파일 입출력 및 데이터 추출 로직 담당.
3.  **AI Viewer (Remote):** AI 스트리밍 대화 인터페이스 및 데이터 시각화.

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18, TypeScript
- **Build Tool:** Vite, Module Federation
- **State Management:** React Hooks, Custom Events (for Inter-app communication)
- **Styling:** Vanilla CSS (Module-based)
- **AI Integration:** Vercel AI SDK

### Backend

- **Runtime:** Node.js (Express)
- **AI Model:** Google Gemini 1.5 Flash
- **Streaming:** Server-Sent Events (SSE) via `streamText`

## 🚀 Getting Started

### 1. Repository Clone

```bash
git clone https://github.com/souplim/ai-doc-hub.git
```

### 2. Environment Variables

`server` 폴더에 `.env` 파일을 생성하고 아래 키를 설정합니다.

```env
GOOGLE_GENERATION_AI_API_KEY=your_gemini_api_key
```

### 3. Installation & Execution

각 서비스 폴더에서 의존성을 설치하고 실행합니다. (Container, Uploader, AI-Viewer, Server)

```bash
# Example for Container
cd container
npm install
npm run dev
```
