import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import Loading from "../loading/Loading";
import "./ChatWindow.css";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:3000/api/chat",
    }),
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

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.parts.map((part, index) =>
              part.type === "text" ? (
                <span key={index}>{part.text}</span>
              ) : null,
            )}
          </div>
        ))}
        {status === "submitted" || status === "streaming" ? <Loading /> : null}
        <div ref={scrollAnchorRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={status !== "ready"}
          placeholder="문서에 대해 질문하세요..."
        />
        <button
          className="chat-submit"
          type="submit"
          disabled={status !== "ready"}
        >
          전송
        </button>
      </form>
    </div>
  );
}
