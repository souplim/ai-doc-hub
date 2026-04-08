# AI Viewer Remote

`ai-viewer`는 이 워크스페이스에서 AI 채팅 화면을 제공하는 Module Federation `remote` 프로젝트입니다.

## 개요

이 프로젝트는 `./ChatWindow` 컴포넌트를 외부에 노출합니다.
`container` 프로젝트는 이 모듈을 `aiViewer/ChatWindow`로 가져와 화면에 렌더링합니다.

노출 주소:

```text
http://localhost:5002/assets/remoteEntry.js
```

## 스크립트

단독 앱으로 실행:

```bash
npm run dev:standalone
```

`npm run dev`는 위 명령의 별칭입니다.

remote 모듈로 실행:

```bash
npm run dev:remote
```

이 명령은 아래 두 작업을 동시에 실행합니다.

- `build:watch`
- `preview`

`dev:remote`에서는 source map이 켜져 있어서 브라우저 디버깅이 조금 더 편합니다.

watch 빌드와 preview를 따로 실행하려면:

```bash
npm run build:watch
```

```bash
npm run preview
```

프로덕션 빌드:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## 사용 패키지

- `@ai-sdk/react`: React용 `useChat` 훅
- `ai`: `DefaultChatTransport` 등 AI SDK 코어 기능

## Rolldown 참고

`ai-viewer`는 현재 로컬 macOS arm64 환경에서 `vite build` 안정성을 위해
`@rolldown/binding-darwin-arm64`를 devDependency로 명시하고 있습니다.

이 패키지는 애플리케이션 기능 자체를 위한 의존성이 아니라, Vite가 내부 번들러인
rolldown을 실행할 때 필요한 네이티브 바인딩입니다.

이론상 optional dependency로 자동 설치될 수 있지만, 실제로는 재설치 후 누락되어
빌드가 깨진 적이 있어서 현재는 명시적으로 유지합니다.

채팅 UI는 백엔드 `/api/chat` 엔드포인트를 호출해 스트리밍 응답을 받도록 구성되어 있습니다.

## 왜 `dev`와 `dev:remote`가 다른가

`@originjs/vite-plugin-federation` 조합에서는 remote 프로젝트의 일반 `vite dev` 서버가 `remoteEntry.js`를 직접 서빙하지 않습니다.
그래서 다음처럼 역할이 나뉩니다.

- `dev:standalone`: 단독 UI 개발용
- `dev:remote`: host 프로젝트가 붙을 수 있도록 remote 번들을 감시 빌드하고 `dist`를 서빙하는 용도

## 로컬 실행 순서

host와 함께 확인하려면 아래 순서를 권장합니다.

1. `server`에서 API 서버 실행
2. `ai-viewer`에서 `npm run dev:remote` 실행
3. `container`에서 `npm run dev` 실행
4. 브라우저에서 `container` 앱 확인

만약 `container`가 먼저 뜨고 `ai-viewer` preview가 아직 준비되지 않았다면, `remoteEntry.js` 404가 날 수 있습니다.
