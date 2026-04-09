import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(() => {
  const enableRemoteDebug = process.env.REMOTE_FEDERATION_DEBUG === "1";

  return {
    plugins: [
      tailwindcss(),
      react(),
      federation({
        name: "aiViewer",
        filename: "remoteEntry.js",
        exposes: {
          "./ChatWindow": "./src/components/chat/ChatWindow.tsx",
        },
        shared: ["react", "react-dom", { "react-hook-form": { requiredVersion: "^7.72.1" } }],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
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
