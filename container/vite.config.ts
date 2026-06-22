import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import babel from "@rolldown/plugin-babel";
import federation from "@originjs/vite-plugin-federation";

const AI_VIEWER_URL = process.env.VITE_AI_VIEWER_URL ?? "http://localhost:5002";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    federation({
      name: "container",
      filename: "remoteEntry.js",
      remotes: {
        aiViewer: `${AI_VIEWER_URL}/assets/remoteEntry.js`,
      },
      shared: ["react", "react-dom"],
    }),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5000,
  },
  preview: {
    port: 5000,
  },
});
