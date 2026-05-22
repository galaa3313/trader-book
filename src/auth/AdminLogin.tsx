import { useEffect, useState } from 'react';
import { Lock, X, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AdminLogin({ onClose }: { onClose: () => void }) {
  const { login } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(user.trim(), pass);
    if (r.ok === true) {
      onClose();
      return;
    }
    setError(r.error);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="w-full max-w-sm glass-strong rounded-2xl p-6 border border-neon-cyan/30 relative">
        <button onClick={onClose} aria-label="Хаах" type="button"
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-ink-800 hover:bg-neon-red/15 hover:text-neon-red text-ink-300 flex items-center justify-center">
          <X size={16} />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-neon-cyan/15 text-neon-cyan flex items-center justify-center">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white">Админ нэвтрэх</h2>
            <p className="text-[11px] text-ink-400">Зөвхөн эрх олгогдсон хэрэглэгчид</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">Хэрэглэгчийн нэр</span>
            <input
              autoFocus value={user} onChange={e => setUser(e.target.value)}
              autoComplete="username"
              className="w-full mt-1 px-3 py-2.5 bg-ink-900/60 border border-ink-700 rounded-lg text-white outline-none focus:border-neon-cyan" />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">Нууц үг</span>
            <input
              type="password" value={pass} onChange={e => setPass(e.target.value)}
              autoComplete="current-password"
              className="w-full mt-1 px-3 py-2.5 bg-ink-900/60 border border-ink-700 rounded-lg text-white outline-none focus:border-neon-cyan font-mono" />
          </label>
          {error && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-neon-red/10 border border-neon-red/40 text-neon-red text-xs">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <button type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-950 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cyan hover:opacity-90">
            <Lock size={14} /> Нэвтрэх
          </button>
        </form>
        <p className="mt-4 text-[10px] text-ink-500 leading-relaxed">
          ⚠ Энэ нь client-side гэрчилгээ. DevTools-оор кодыг уншвал нууц үг харагдана —
          бодит хамгаалалт хэрэгтэй бол серверийн нэвтрэлт нэмэх шаардлагатай.
        </p>
      </div>
    </div>
  );
}
