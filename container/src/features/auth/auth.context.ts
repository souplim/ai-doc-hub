import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
}

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
