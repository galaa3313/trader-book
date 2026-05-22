import { useEffect, useState } from 'react';

const KEY = 'admin_overrides_v1';

type BookOverride = Partial<{
  titleEn: string;
  titleMn: string;
  descEn: string;
  descMn: string;
  authorEn: string;
  authorMn: string;
}>;

export type Overrides = {
  books?: Record<string, BookOverride>;
};

const load = (): Overrides => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
};

const save = (o: Overrides) => {
  try { localStorage.setItem(KEY, JSON.stringify(o)); } catch {}
  window.dispatchEvent(new CustomEvent('admin-overrides-changed'));
};

let cache: Overrides = load();

export function getOverrides(): Overrides { return cache; }

export function setBookOverride(id: string, patch: BookOverride) {
  const merged: BookOverride = { ...(cache.books?.[id] || {}), ...patch };
  // strip empty strings so the original value shines through
  (Object.keys(merged) as (keyof BookOverride)[]).forEach(k => {
    const v = merged[k];
    if (v === undefined || v === '') delete merged[k];
  });
  const nextBooks = { ...(cache.books || {}) };
  if (Object.keys(merged).length === 0) delete nextBooks[id];
  else nextBooks[id] = merged;
  cache = { ...cache, books: nextBooks };
  save(cache);
}

export function resetBookOverride(id: string) {
  if (!cache.books?.[id]) return;
  const nextBooks = { ...cache.books };
  delete nextBooks[id];
  cache = { ...cache, books: nextBooks };
  save(cache);
}

export function resetAll() { cache = {}; save({}); }

export function exportJSON(): string { return JSON.stringify(cache, null, 2); }

export function importJSON(text: string): { ok: boolean; error?: string } {
  try {
    const o = JSON.parse(text);
    if (typeof o !== 'object' || o === null) throw new Error('Object байх ёстой');
    cache = o;
    save(o);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e.message || e) };
  }
}

export function useOverrides(): Overrides {
  const [o, setO] = useState<Overrides>(cache);
  useEffect(() => {
    const update = () => setO({ ...cache });
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) { cache = load(); setO(cache); }
    };
    window.addEventListener('admin-overrides-changed', update);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('admin-overrides-changed', update);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return o;
}

export function applyBookOverride<T extends { id: string }>(book: T, overrides: Overrides): T {
  const o = overrides.books?.[book.id];
  return o ? { ...book, ...o } : book;
}
