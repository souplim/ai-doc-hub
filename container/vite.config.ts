import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    federation({
      name: "container",
      filename: "remoteEntry.js",
      remotes: {
        aiViewer: "http://localhost:5002/assets/remoteEntry.js",
        uploader: "http://localhost:5001/assets/remoteEntry.js", // Vite host는 assets 경로를 사용
      },
      shared: ["react", "react-dom"],
    }),
  ],
});
