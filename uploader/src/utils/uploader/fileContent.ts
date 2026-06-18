import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  dispatchUploaderFileUploaded,
  type UploadedFileContent,
} from "@ai-doc-hub/events/uploader";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const shouldReadFileAsText = (file: File) =>
  file.type.startsWith("text/") ||
  file.name.toLowerCase().endsWith(".txt") ||
  file.name.toLowerCase().endsWith(".md");

const isPdf = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

const readTextFile = (file: File) =>
  new Promise<UploadedFileContent>((resolve) => {
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

const readPdfFile = async (file: File): Promise<UploadedFileContent> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageTexts = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) =>
        pdf.getPage(i + 1).then((page) => page.getTextContent()),
      ),
    );
    const content = pageTexts
      .flatMap((page) =>
        page.items.map((item) => ("str" in item ? item.str : "")),
      )
      .join(" ")
      .trim();
    return { fileName: file.name, content: content || undefined };
  } catch {
    return { fileName: file.name };
  }
};

export const readFileContent = (file: File): Promise<UploadedFileContent> => {
  if (isPdf(file)) return readPdfFile(file);
  if (shouldReadFileAsText(file)) return readTextFile(file);
  return Promise.resolve({ fileName: file.name });
};

export { dispatchUploaderFileUploaded };
