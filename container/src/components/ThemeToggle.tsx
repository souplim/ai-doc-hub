import { Moon, Sun } from "lucide-react";
import { Button } from "@ai-doc-hub/ui/button";
import type { Theme } from "./theme";

type ThemeToggleProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
};

function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  return (
    <div className="theme-toggle" role="group" aria-label="테마 선택">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={`theme-toggle-button${theme === "light" ? " is-active" : ""}`}
        onClick={() => onThemeChange("light")}
        aria-pressed={theme === "light"}
        aria-label="라이트 모드"
      >
        <Sun aria-hidden="true" />
        <span className="sr-only">Light</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={`theme-toggle-button${theme === "dark" ? " is-active" : ""}`}
        onClick={() => onThemeChange("dark")}
        aria-pressed={theme === "dark"}
        aria-label="다크 모드"
      >
        <Moon aria-hidden="true" />
        <span className="sr-only">Dark</span>
      </Button>
    </div>
  );
}

export default ThemeToggle;
