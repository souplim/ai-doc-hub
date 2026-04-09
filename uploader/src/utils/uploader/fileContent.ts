import {
  dispatchUploaderFileUploaded,
  type UploadedFileContent,
} from "@ai-doc-hub/events/uploader";

const shouldReadFileAsText = (file: File) =>
  file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt");

// 파일 내용을 읽어서 파일 이름과 함께 반환하는 함수
export const readFileContent = (file: File) =>
  new Promise<UploadedFileContent>((resolve) => {
    if (!shouldReadFileAsText(file)) {
      resolve({ fileName: file.name });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content =
        typeof event.target?.result === "string"
          ? event.target.result
          : undefined;
      resolve({ fileName: file.name, content });
    };
    reader.onerror = () => resolve({ fileName: file.name });
    reader.readAsText(file);
  });

export { dispatchUploaderFileUploaded };
