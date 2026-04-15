import "./LoginPage.css";
import { AUTH_SERVER_URL } from "../../app/config/config";

export default function LoginPage() {
  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </span>
          <h1 className="login-title">AI Doc Hub</h1>
          <p className="login-desc">
            문서를 업로드하고 AI와 대화하세요.
            <br />
            Google 계정으로 로그인하면 바로 시작할 수 있습니다.
          </p>
        </div>

        <hr className="login-divider" />

        <a href={`${AUTH_SERVER_URL}/auth/google`} className="login-google-btn">
          <GoogleIcon />
          Google로 로그인
        </a>

        <p className="login-footer">
          로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하는 것으로
          간주됩니다.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56C11.242 14.1 10.211 14.42 9 14.42c-2.392 0-4.415-1.614-5.138-3.783H.957v2.332C2.438 15.983 5.482 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.862 10.637A5.302 5.302 0 0 1 3.545 9c0-.563.096-1.11.317-1.637V5.031H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.032l2.905-2.395z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.969L3.862 7.3C4.585 5.131 6.608 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
