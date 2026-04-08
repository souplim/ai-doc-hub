import "./Loading.css";

function Loading() {
  return (
    <div className="loading-indicator" aria-live="polite" aria-label="응답 생성 중">
      <span className="loading-dot" />
      <span className="loading-dot" />
      <span className="loading-dot" />
      <span className="loading-text">응답 생성 중...</span>
    </div>
  );
}

export default Loading;
