import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(() => {
  const enableRemoteDebug = process.env.REMOTE_FEDERATION_DEBUG === "1";

  return {
    plugins: [
      react(),
      federation({
        name: "aiViewer",
        filename: "remoteEntry.js",
        exposes: {
          "./ChatWindow": "./src/components/chat/ChatWindow.tsx",
        },
        shared: ["react", "react-dom"],
      }),
    ],
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
      sourcemap: enableRemoteDebug,
    },
    server: {
      port: 5002,
    },
  };
});
