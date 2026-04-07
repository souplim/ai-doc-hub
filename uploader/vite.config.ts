import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(() => {
  const enableRemoteDebug = process.env.REMOTE_FEDERATION_DEBUG === "1";

  return {
    plugins: [
      react(),
      federation({
        name: "uploader",
        filename: "remoteEntry.js", // 배포 시 생성될 진입점 파일명
        exposes: {
          "./Uploader": "./src/components/Uploader.tsx", // 내보낼 컴포넌트 경로
        },
        shared: ["react", "react-dom"], // 공통 라이브러리 공유
      }),
    ],
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
      sourcemap: enableRemoteDebug,
    },

    server: {
      port: 5001, // Uploader 앱이 사용할 포트
    },
  };
});
