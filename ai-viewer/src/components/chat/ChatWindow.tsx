import { useChat } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "../loading/Loading";
import MarkdownMessage from "./MarkdownMessage";
import ChatStatusNotice from "./ChatStatusNotice";
import "./ChatWindow.css";

const chatSchema = z.object({
  message: z.string().min(1),
});

type ChatFormValues = z.infer<typeof chatSchema>;

export default function ChatWindow({
  documentContext,
}: {
  documentContext?: string;
}) {
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

  const { register, handleSubmit, reset } = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, status]);

  const isBusy = status === "submitted" || status === "streaming";

  const onSubmit = (data: ChatFormValues) => {
    sendMessage(
      { text: data.message },
      {
        body: {
          documentContext,
        },
      },
    );
    reset();
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
        {isBusy ? <Loading /> : null}
        {isBusy && !error ? (
          <ChatStatusNotice
            tone="warning"
            title="응답이 조금 늦어지고 있어요"
            description="AI가 응답을 준비하는 데 평소보다 오래 걸리고 있어요. 잠시만 기다려 주세요."
            delayed
          />
        ) : null}
        <div ref={scrollAnchorRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("message")}
          disabled={isBusy}
          placeholder="문서에 대해 질문하세요..."
        />
        <Button type="submit" disabled={isBusy}>
          전송
        </Button>
      </form>
    </div>
  );
}
