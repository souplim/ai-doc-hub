import { useId, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@ai-doc-hub/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import {
  ACCEPT_ATTRIBUTE,
  formatBytes,
  mergeSelectedFiles,
  splitFilesByValidation,
} from "../../utils/uploader/fileValidation";
import {
  dispatchUploaderFileUploaded,
  readFileContent,
} from "../../utils/uploader/fileContent";
import { isDirectoryItem } from "../../utils/uploader/drag";
import "./Uploader.css";

function Uploader() {
  const inputId = useId();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const updateSelectedFiles = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setSelectedFiles((currentFiles) => mergeSelectedFiles(currentFiles, files));
    void Promise.all(files.map(readFileContent)).then(
      dispatchUploaderFileUploaded,
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const { validFiles, invalidFiles } = splitFilesByValidation(files);

    if (invalidFiles.length > 0) {
      toast("JPG, PNG, WEBP, GIF, PDF, TXT, DOC, DOCX 파일만 업로드할 수 있어요.");
    }

    updateSelectedFiles(validFiles);
    event.target.value = "";
  };

  const handleReset = () => {
    setSelectedFiles([]);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const items = Array.from(event.dataTransfer.items ?? []);
    const files = Array.from(event.dataTransfer.files ?? []);
    const { validFiles, invalidFiles } = splitFilesByValidation(files);
    const hasDirectoryItem = items.some(isDirectoryItem);
    const hasNonFileItem = items.some((item) => item.kind !== "file");

    if (validFiles.length === 0 && (hasDirectoryItem || hasNonFileItem)) {
      toast("폴더는 업로드할 수 없어요. 파일만 추가해 주세요.");
      return;
    }

    if (hasDirectoryItem) {
      toast("폴더는 제외하고 파일만 추가했어요.");
    } else if (invalidFiles.length > 0) {
      toast("허용되지 않은 형식은 제외하고 파일만 추가했어요.");
    } else if (hasNonFileItem) {
      toast("파일이 아닌 항목은 제외하고 파일만 추가했어요.");
    }

    updateSelectedFiles(validFiles);
  };

  return (
    <section className="uploader-card">
      <div className="uploader-header">
        <Badge variant="secondary">File uploader</Badge>
        <p>
          Module Federation으로 노출되는 업로더 컴포넌트입니다. 파일을 선택하면
          현재 세션 기준으로 목록을 바로 확인할 수 있습니다.
        </p>
      </div>

      <label
        className={`uploader-dropzone${isDragging ? " is-dragging" : ""}`}
        htmlFor={inputId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="uploader-dropzone-title">
          파일을 선택하거나 드래그하세요
        </span>
        <span className="uploader-dropzone-copy">
          여러 파일을 한 번에 선택할 수 있습니다.
        </span>
      </label>

      <input
        id={inputId}
        className="uploader-input"
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        multiple
        onChange={handleFileChange}
      />

      <div className="uploader-summary">
        <strong>{selectedFiles.length}개 파일 선택됨</strong>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={handleReset}
          disabled={selectedFiles.length === 0}
        >
          초기화
        </Button>
      </div>

      {selectedFiles.length > 0 ? (
        <ul className="uploader-file-list">
          {selectedFiles.map((file) => (
            <li
              className="uploader-file-item"
              key={`${file.name}-${file.size}`}
            >
              <div>
                <strong>{file.name}</strong>
                <p>{file.type || "알 수 없는 형식"}</p>
              </div>
              <span>{formatBytes(file.size)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="uploader-empty-state">
          아직 선택된 파일이 없습니다. 업로드 UI 연결 전 단계에서 화면
          확인용으로 사용할 수 있습니다.
        </p>
      )}
      <Toaster />
    </section>
  );
}

export default Uploader;
