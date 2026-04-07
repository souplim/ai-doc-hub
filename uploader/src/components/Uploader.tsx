import { useId, useState, type ChangeEvent } from "react";
import "./Uploader.css";

const formatBytes = (size: number) => {
  if (size === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1,
  );
  const value = size / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

function Uploader() {
  const inputId = useId();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    setSelectedFiles(files);

    // 파일 업로드 로직 실행 후...
    const fileEvent = new CustomEvent("uploader:file-uploaded", {
      detail: { fileName: files[0]?.name, timestamp: new Date() },
    });
    window.dispatchEvent(fileEvent); // 브라우저 전체에 알림
  };

  const handleReset = () => {
    setSelectedFiles([]);
  };

  return (
    <section className="uploader-card">
      <div className="uploader-header">
        <span className="uploader-badge">Remote uploader</span>
        <h1>파일 업로더</h1>
        <p>
          Module Federation으로 노출되는 업로더 컴포넌트입니다. 파일을 선택하면
          현재 세션 기준으로 목록을 바로 확인할 수 있습니다.
        </p>
      </div>

      <label className="uploader-dropzone" htmlFor={inputId}>
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
        multiple
        onChange={handleFileChange}
      />

      <div className="uploader-summary">
        <strong>{selectedFiles.length}개 파일 선택됨</strong>
        <button
          className="uploader-reset"
          type="button"
          onClick={handleReset}
          disabled={selectedFiles.length === 0}
        >
          초기화
        </button>
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
    </section>
  );
}

export default Uploader;
