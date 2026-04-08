import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import Loading from "../loading/Loading";
import MarkdownMessage from "./MarkdownMessage";
import ChatStatusNotice from "./ChatStatusNotice";
import "./ChatWindow.css";

export default function ChatWindow({
  documentContext,
}: {
  documentContext?: string;
}) {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:3000/api/chat",
    }),
    onError: (err) => {
      setErrorMessage(err.message);
    },
  });

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, status]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    sendMessage(
      { text: input },
      {
        body: {
          documentContext,
        },
      },
    );
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.parts.map((part, index) =>
              part.type === "text" ? (
                <MarkdownMessage key={index} text={part.text} />
              ) : null,
            )}
          </div>
        ))}
        {errorMessage ? (
          <ChatStatusNotice
            tone="error"
            title="응답을 불러오지 못했어요"
            description={errorMessage}
          />
        ) : null}
        {status === "submitted" || status === "streaming" ? <Loading /> : null}
        {(status === "submitted" || status === "streaming") && !error ? (
          <ChatStatusNotice
            tone="warning"
            title="응답이 조금 늦어지고 있어요"
            description="AI가 응답을 준비하는 데 평소보다 오래 걸리고 있어요. 잠시만 기다려 주세요."
            delayed
          />
        ) : null}
        <div ref={scrollAnchorRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={status === "submitted" || status === "streaming"}
          placeholder="문서에 대해 질문하세요..."
        />
        <button
          className="chat-submit"
          type="submit"
          disabled={status === "submitted" || status === "streaming"}
        >
          전송
        </button>
      </form>
    </div>
  );
}
