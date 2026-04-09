import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(() => {
  const enableRemoteDebug = process.env.REMOTE_FEDERATION_DEBUG === "1";
  const enableRemoteWatch = process.env.REMOTE_FEDERATION_WATCH === "1";

  return {
    plugins: [
      tailwindcss(),
      react(),
      federation({
        name: "uploader",
        filename: "remoteEntry.js", // 배포 시 생성될 진입점 파일명
        exposes: {
          "./Uploader": "./src/components/uploader/Uploader.tsx", // 내보낼 컴포넌트 경로
        },
        shared: ["react", "react-dom"], // 공통 라이브러리 공유
      }),
    ],
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
      sourcemap: enableRemoteDebug,
      watch: enableRemoteWatch
        ? {
            // Avoid self-triggered rebuilds when build --watch writes to dist/.
            exclude: ["dist/**"],
          }
        : null,
    },

    server: {
      port: 5001, // Uploader 앱이 사용할 포트
    },
  };
});
