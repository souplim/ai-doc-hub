import { useEffect } from "react";
import "./Toast.css";

type ToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

function Toast({ message, onClose, duration = 2600 }: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [duration, onClose]);

  return (
    <div className="toast" role="status" aria-live="polite">
      <p>{message}</p>
      <button className="toast-close" type="button" onClick={onClose}>
        닫기
      </button>
    </div>
  );
}

export default Toast;
