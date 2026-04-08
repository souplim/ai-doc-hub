import React, { Suspense, useEffect } from "react";
import "./App.css";
const ChatWindow = React.lazy(() => import("aiViewer/ChatWindow"));
const Uploader = React.lazy(() => import("uploader/Uploader"));

function App() {
  const [fileContents, setFileContents] = React.useState<
    Array<{ fileName: string; content?: string }>
  >([]);
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
    const handleFileEvent = (e: WindowEventMap["uploader:file-uploaded"]) => {
      setFileContents(e.detail.files);
      // 여기서 상태를 변경하거나 다른 Micro App에 신호를 보냄
    };

    window.addEventListener("uploader:file-uploaded", handleFileEvent);
    return () =>
      window.removeEventListener("uploader:file-uploaded", handleFileEvent);
  }, []);

  return (
    <main className="container-shell">
      <Suspense fallback={<div>Loading...</div>}>
        <section className="remote-grid">
          <article className="remote-panel">
            <h2>Uploader</h2>
            <Uploader />
          </article>
          <article className="remote-panel">
            <h2>AI Viewer</h2>
            <ChatWindow documentContext={documentContext} />
          </article>
        </section>
      </Suspense>
    </main>
  );
}

export default App;
