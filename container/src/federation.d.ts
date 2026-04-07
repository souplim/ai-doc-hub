declare module "uploader/Uploader" {
  import type { ComponentType } from "react";

  const Uploader: ComponentType;
  export default Uploader;
}

interface UploaderFileUploadedDetail {
  fileName?: string;
  timestamp: Date;
}

interface WindowEventMap {
  "uploader:file-uploaded": CustomEvent<UploaderFileUploadedDetail>;
}
