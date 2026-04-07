import React, { Suspense, useEffect } from "react";
import "./App.css";
const Uploader = React.lazy(() => import("uploader/Uploader"));

function App() {
  useEffect(() => {
    const handleFileEvent = (
      e: WindowEventMap["uploader:file-uploaded"],
    ) => {
      console.log("파일 업로드 감지됨:", e.detail.fileName);
      // 여기서 상태를 변경하거나 다른 Micro App에 신호를 보냄
    };

    window.addEventListener("uploader:file-uploaded", handleFileEvent);
    return () =>
      window.removeEventListener("uploader:file-uploaded", handleFileEvent);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Uploader />
    </Suspense>
  );
}

export default App;
