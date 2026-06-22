import { useChat } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Paperclip, X } from "lucide-react";
import { Button } from "@ai-doc-hub/ui/button";
import { Input } from "@ai-doc-hub/ui/input";
import Loading from "../loading/Loading";
import MarkdownMessage from "./MarkdownMessage";
import ChatStatusNotice from "./ChatStatusNotice";
import {
  ACCEPT_ATTRIBUTE,
  formatBytes,
  mergeSelectedFiles,
  splitFilesByValidation,
} from "../../utils/fileValidation";
import { readFileContent } from "../../utils/fileContent";
import { isDirectoryItem } from "../../utils/drag";
import "./ChatWindow.css";

const chatSchema = z.object({
  message: z.string().min(1),
});

type ChatFormValues = z.infer<typeof chatSchema>;

const SERVER_URL = (
  import.meta.env.VITE_SERVER_URL?.trim() || "http://localhost:3000"
).replace(/\/$/, "");

const CHAT_API_URL = `${SERVER_URL}/api/chat`;

export default function ChatWindow() {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [documentContext, setDocumentContext] = useState<string | undefined>(
    undefined,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: CHAT_API_URL }),
    onError: (err) => setErrorMessage(err.message),
  });

  const { register, handleSubmit, reset } = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  useEffect(() => {
    if (attachedFiles.length === 0) {
      setDocumentContext(undefined);
      return;
    }
    void Promise.all(attachedFiles.map(readFileContent)).then((contents) => {
      const readable = contents.filter((f) => f.content?.trim());
      if (readable.length === 0) {
        setDocumentContext(undefined);
        return;
      }
      setDocumentContext(
        readable
          .map((f) => `[파일명: ${f.fileName}]\n${f.content?.trim() ?? ""}`)
          .join("\n\n---\n\n"),
      );
    });
  }, [attachedFiles]);

  const addFiles = useCallback((files: File[]) => {
    const { validFiles } = splitFilesByValidation(files);
    if (validFiles.length > 0) {
      setAttachedFiles((prev) => mergeSelectedFiles(prev, validFiles));
    }
  }, []);

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const items = Array.from(e.dataTransfer.items ?? []);
    const files = Array.from(e.dataTransfer.files ?? []);
    const hasDirectoryItem = items.some(isDirectoryItem);
    const { validFiles } = splitFilesByValidation(files);
    if (!hasDirectoryItem || validFiles.length > 0) {
      addFiles(validFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  const isBusy = status === "submitted" || status === "streaming";

  const onSubmit = (data: ChatFormValues) => {
    sendMessage(
      { text: data.message },
      { body: { documentContext } },
    );
    reset();
  };

  return (
    <div
      className={`chat-container${isDragging ? " is-dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="chat-drop-overlay" aria-hidden>
          <Paperclip size={32} strokeWidth={1.5} />
          <p>파일을 여기에 놓으세요</p>
        </div>
      )}

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

      {attachedFiles.length > 0 && (
        <ul className="chat-attachments" aria-label="첨부 파일 목록">
          {attachedFiles.map((file, i) => (
            <li key={`${file.name}-${i}`} className="chat-attachment-chip">
              <span className="chat-attachment-name">{file.name}</span>
              <span className="chat-attachment-size">{formatBytes(file.size)}</span>
              <button
                type="button"
                className="chat-attachment-remove"
                onClick={() => removeFile(i)}
                aria-label={`${file.name} 제거`}
              >
                <X size={11} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="chat-form" onSubmit={handleSubmit(onSubmit)}>
        <button
          type="button"
          className="chat-attach-btn"
          onClick={() => fileInputRef.current?.click()}
          aria-label="파일 첨부"
          title="파일 첨부"
        >
          <Paperclip size={17} />
        </button>
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          multiple
          className="chat-file-input"
          onChange={handleFileInput}
        />
        <Input
          {...register("message")}
          disabled={isBusy}
          placeholder="파일을 첨부하거나 질문을 입력하세요…"
        />
        <Button type="submit" disabled={isBusy}>
          전송
        </Button>
      </form>
    </div>
  );
}
