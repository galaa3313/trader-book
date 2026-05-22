import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Role = 'guest' | 'admin';

// ⚠️ Client-side gate only. Anyone with DevTools can read these.
// For real security a backend is required. This deters casual visitors only.
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Agent.88';
const SESSION_KEY = 'auth:session:v1';

type AuthCtx = {
  role: Role;
  login: (u: string, p: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    try { return localStorage.getItem(SESSION_KEY) === 'admin' ? 'admin' : 'guest'; }
    catch { return 'guest'; }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) setRole(e.newValue === 'admin' ? 'admin' : 'guest');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login: AuthCtx['login'] = (u, p) => {
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      try { localStorage.setItem(SESSION_KEY, 'admin'); } catch {}
      setRole('admin');
      return { ok: true };
    }
    return { ok: false, error: 'Нэр эсвэл нууц үг буруу' };
  };

  const logout = () => {
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    setRole('guest');
  };

  return <Ctx.Provider value={{ role, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}

export const isAdminRole = (role: Role) => role === 'admin';
