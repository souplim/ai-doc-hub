declare module "aiViewer/ChatWindow" {
  import type { ComponentType } from "react";

  const ChatWindow: ComponentType<{
    documentContext?: string;
  }>;
  export default ChatWindow;
}
