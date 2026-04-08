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
    <div
      className={`chat-status-notice is-${tone}${delayed ? " is-delayed" : ""}`}
      role="status"
      aria-live="polite"
    >
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export default ChatStatusNotice;
