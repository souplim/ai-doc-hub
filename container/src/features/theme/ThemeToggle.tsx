import { Moon, Sun } from "lucide-react";
import { Button } from "@ai-doc-hub/ui/button";
import type { Theme } from "./theme";

type ThemeToggleProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
};

function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="theme-toggle-button"
      onClick={() => onThemeChange(isDark ? "light" : "dark")}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}

export default ThemeToggle;
