import React, { Suspense } from "react";
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

function AppShell() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = React.useState<Theme>(() => getPreferredTheme());

  React.useEffect(() => {
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
      <header className="container-toolbar">
        <div className="container-toolbar-copy">
          <h2>AI Doc Hub</h2>
        </div>
        <div className="container-toolbar-actions">
          <UserMenu />
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
        </div>
      </header>
      <Suspense fallback={<div style={{ color: "var(--text)" }}>로딩 중…</div>}>
        <section className="chat-section">
          <ChatWindow />
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
