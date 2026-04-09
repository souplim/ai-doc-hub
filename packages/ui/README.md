# `@ai-doc-hub/ui`

워크스페이스에서 공용으로 사용하는 shadcn/ui 패키지입니다.

## 운영 규칙

새 shadcn 컴포넌트는 각 앱 폴더가 아니라 반드시 이 디렉터리에서 생성합니다.

## 자주 쓰는 명령어

```bash
cd packages/ui
npx shadcn@latest add button
```

```bash
cd packages/ui
npx shadcn@latest add dialog
```

## 컴포넌트 추가 후 해야 할 일

1. 필요하면 `src/index.ts` 또는 `package.json`의 `exports`에 노출 경로를 추가합니다.
2. 앱에서는 `@ai-doc-hub/ui/...` 경로로 import해서 사용합니다.
