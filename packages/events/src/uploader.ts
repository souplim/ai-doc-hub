export const UPLOADER_FILE_UPLOADED_EVENT = "uploader:file-uploaded";

export type UploadedFileContent = {
  fileName: string;
  content?: string;
};

export type UploaderFileUploadedDetail = {
  files: UploadedFileContent[];
  timestamp: Date;
};

export function dispatchUploaderFileUploaded(
  fileContents: UploadedFileContent[],
) {
  const fileEvent = new CustomEvent<UploaderFileUploadedDetail>(
    UPLOADER_FILE_UPLOADED_EVENT,
    {
      detail: {
        files: fileContents,
        timestamp: new Date(),
      },
    },
  );

  window.dispatchEvent(fileEvent);
}

export function addUploaderFileUploadedListener(
  listener: (event: CustomEvent<UploaderFileUploadedDetail>) => void,
) {
  const eventListener: EventListener = (event) => {
    listener(event as CustomEvent<UploaderFileUploadedDetail>);
  };

  window.addEventListener(UPLOADER_FILE_UPLOADED_EVENT, eventListener);

  return () => {
    window.removeEventListener(UPLOADER_FILE_UPLOADED_EVENT, eventListener);
  };
}
