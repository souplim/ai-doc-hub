import { useAuth } from "./useAuth";
import "./Profile.css";

export default function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="user-menu">
      {user.photo && (
        <img
          src={user.photo}
          alt={user.name}
          className="user-avatar"
          referrerPolicy="no-referrer"
        />
      )}
      <span className="user-name">{user.name}</span>
      <button className="logout-btn" onClick={logout}>
        로그아웃
      </button>
    </div>
  );
}
