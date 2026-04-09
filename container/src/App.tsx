import React, { Suspense, useEffect } from "react";
import {
  addUploaderFileUploadedListener,
  type UploadedFileContent,
} from "@ai-doc-hub/events/uploader";
import "./App.css";
import ThemeToggle from "./components/ThemeToggle";
import { applyTheme, getPreferredTheme, type Theme } from "./components/theme";
const ChatWindow = React.lazy(() => import("aiViewer/ChatWindow"));
const Uploader = React.lazy(() => import("uploader/Uploader"));

function App() {
  const [theme, setTheme] = React.useState<Theme>(() => getPreferredTheme());
  const [fileContents, setFileContents] = React.useState<UploadedFileContent[]>(
    [],
  );
  const documentContext = React.useMemo(() => {
    const readableFiles = fileContents.filter((file) => file.content?.trim());

    if (readableFiles.length === 0) {
      return undefined;
    }

    return readableFiles
      .map(
        (file) => `[파일명: ${file.fileName}]\n${file.content?.trim() ?? ""}`,
      )
      .join("\n\n---\n\n");
  }, [fileContents]);

  useEffect(() => {
    return addUploaderFileUploadedListener((e) => {
      setFileContents(e.detail.files);
      // 여기서 상태를 변경하거나 다른 Micro App에 신호를 보냄
    });
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <main className="container-shell">
      <header className="container-toolbar">
        <div className="container-toolbar-copy">
          <h2>Micro Frontend AI Workspace</h2>
        </div>
        <ThemeToggle theme={theme} onThemeChange={setTheme} />
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <section className="remote-grid">
          <article className="remote-panel">
            <h3>Uploader</h3>
            <Uploader />
          </article>
          <article className="remote-panel">
            <h3>AI Viewer</h3>
            <ChatWindow documentContext={documentContext} />
          </article>
        </section>
      </Suspense>
    </main>
  );
}

export default App;
