declare module "uploader/Uploader" {
  import type { ComponentType } from "react";

  const Uploader: ComponentType;
  export default Uploader;
}

declare module "aiViewer/ChatWindow" {
  import type { ComponentType } from "react";

  const ChatWindow: ComponentType<{
    documentContext?: string;
  }>;
  export default ChatWindow;
}

interface UploaderFileUploadedDetail {
  files: Array<{
    fileName: string;
    content?: string;
  }>;
  timestamp: Date;
}

interface WindowEventMap {
  "uploader:file-uploaded": CustomEvent<UploaderFileUploadedDetail>;
}
