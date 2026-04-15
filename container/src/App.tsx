import React, { Suspense, useEffect, useMemo } from "react";
import {
  addUploaderFileUploadedListener,
  type UploadedFileContent,
} from "@ai-doc-hub/events/uploader";
import "./App.css";
import ThemeToggle from "./features/theme/ThemeToggle";
import {
  applyTheme,
  getPreferredTheme,
  type Theme,
} from "./features/theme/theme";
import { AuthProvider } from "./features/auth/AuthContext";
import { useAuth } from "./features/auth/useAuth";
import LoginPage from "./features/auth/LoginPage";
import UserMenu from "./features/auth/Profile";

const ChatWindow = React.lazy(() => import("aiViewer/ChatWindow"));
const Uploader = React.lazy(() => import("uploader/Uploader"));

function AppShell() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = React.useState<Theme>(() => getPreferredTheme());
  const [fileContents, setFileContents] = React.useState<UploadedFileContent[]>(
    [],
  );

  const documentContext = useMemo(() => {
    const readableFiles = fileContents.filter((file) => file.content?.trim());
    if (readableFiles.length === 0) return undefined;
    return readableFiles
      .map(
        (file) => `[파일명: ${file.fileName}]\n${file.content?.trim() ?? ""}`,
      )
      .join("\n\n---\n\n");
  }, [fileContents]);

  useEffect(() => {
    return addUploaderFileUploadedListener((e) => {
      setFileContents(e.detail.files);
    });
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  if (loading) {
    return (
      <main
        className="container-shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100svh",
        }}
      >
        <p style={{ color: "var(--text)" }}>로딩 중…</p>
      </main>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <main className="container-shell">
      {/* header */}
      <header className="container-toolbar">
        <div className="container-toolbar-copy">
          <h2>Micro Frontend AI Workspace</h2>
        </div>
        {/* toolbar actions */}
        <div className="container-toolbar-actions">
          <UserMenu />
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
        </div>
      </header>
      {/* main content */}
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

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
