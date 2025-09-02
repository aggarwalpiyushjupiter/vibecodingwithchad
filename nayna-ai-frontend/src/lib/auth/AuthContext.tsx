import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthResponse, loginWithEmail, loginWithGoogle } from '../../services/api';

type User = AuthResponse['user'] | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('nayna_auth');
    if (stored) {
      const parsed = JSON.parse(stored) as { user: User; token: string };
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const persist = (payload: AuthResponse) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem('nayna_auth', JSON.stringify(payload));
  };

  const signInWithEmail = async (email: string, password: string) => {
    const resp = await loginWithEmail({ email, password });
    persist(resp);
  };

  const signInWithGoogle = async () => {
    const resp = await loginWithGoogle();
    persist(resp);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nayna_auth');
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    signInWithEmail,
    signInWithGoogle,
    signOut
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

