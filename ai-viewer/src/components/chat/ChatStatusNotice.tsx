import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@ai-doc-hub/ui/utils";
import "./ChatStatusNotice.css";

type ChatStatusNoticeProps = {
  tone: "info" | "warning" | "error";
  title: string;
  description: string;
  delayed?: boolean;
};

function ChatStatusNotice({
  tone,
  title,
  description,
  delayed = false,
}: ChatStatusNoticeProps) {
  return (
    <Alert
      variant={tone === "error" ? "destructive" : "default"}
      className={cn(
        delayed && "is-delayed",
        tone === "warning" &&
          "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
      )}
      aria-live="polite"
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default ChatStatusNotice;
