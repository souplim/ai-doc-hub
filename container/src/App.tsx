import React, { Suspense, useEffect } from "react";
import "./App.css";
const ChatWindow = React.lazy(() => import("aiViewer/ChatWindow"));
const Uploader = React.lazy(() => import("uploader/Uploader"));

function App() {
  const [fileContents, setFileContents] = React.useState<
    Array<{ fileName: string; content?: string }>
  >([]);

  useEffect(() => {
    const handleFileEvent = (e: WindowEventMap["uploader:file-uploaded"]) => {
      console.log("파일 업로드 감지됨:", e.detail.files);
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
            <ChatWindow />
          </article>
        </section>
      </Suspense>
    </main>
  );
}

export default App;
