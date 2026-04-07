# Container Host

`container`는 이 워크스페이스에서 Module Federation `host` 역할을 하는 프로젝트입니다.

## 개요

이 프로젝트는 `uploader` remote가 노출하는 `uploader/Uploader` 모듈을 가져와 화면에 렌더링합니다.

현재 연결 대상 remote:

```text
http://localhost:5001/assets/remoteEntry.js
```

## 스크립트

개발 서버 실행:

```bash
npm run dev
```

프로덕션 빌드:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

빌드 결과 preview:

```bash
npm run preview
```

## 로컬 실행 순서

`container`가 정상적으로 remote를 불러오려면 먼저 `uploader`가 준비되어 있어야 합니다.

1. `uploader`에서 `npm run dev:remote` 실행
2. `container`에서 `npm run dev` 실행
3. 브라우저에서 host 화면 확인

`uploader`가 실행 중이 아니거나 `preview`가 아직 뜨지 않았다면, 브라우저에서 `remoteEntry.js` 404 에러가 발생할 수 있습니다.

## 참고

`container`는 React Compiler preset을 사용하는 설정이 들어 있으므로 일반적인 Vite 템플릿보다 개발/빌드가 조금 더 무거울 수 있습니다.
