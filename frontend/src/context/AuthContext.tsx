/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as api from "../lib/api";

const STORAGE_KEY = "ide_web_auth_state";

type StoredAuthState = {
  token: string | null;
  user: api.User | null;
};

interface AuthContextValue {
  user: api.User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<api.User>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<api.User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredAuth(): StoredAuthState {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { token: null, user: null };
  }

  try {
    return JSON.parse(stored) as StoredAuthState;
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<StoredAuthState>(() =>
    loadStoredAuth()
  );

  useEffect(() => {
    api.setAuthToken(authState.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    const nextState = { token: result.token, user: result.user };
    setAuthState(nextState);
    return result.user;
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    const result = await api.register(email, username, password);
    const nextState = { token: result.token, user: result.user };
    setAuthState(nextState);
    return result.user;
  };

  const logout = () => {
    setAuthState({ token: null, user: null });
    api.setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      login,
      register,
      logout,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
