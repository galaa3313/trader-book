import { useEffect, useState } from 'react';

const LOCAL_KEY = 'admin_overrides_v1';
const REMOTE_URL = '/admin-overrides.json';

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

// ---------- LOCAL (admin's working draft, this browser only) ----------

const loadLocal = (): Overrides => {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); }
  catch { return {}; }
};

const saveLocal = (o: Overrides) => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(o)); } catch {}
  window.dispatchEvent(new CustomEvent('admin-overrides-changed'));
};

// ---------- REMOTE (published JSON file, fetched once at startup) ----------

let remote: Overrides = {};
let remoteFetched = false;
let remoteFetchPromise: Promise<void> | null = null;

export function fetchRemoteOverrides(): Promise<void> {
  if (remoteFetched) return Promise.resolve();
  if (remoteFetchPromise) return remoteFetchPromise;
  remoteFetchPromise = (async () => {
    try {
      const r = await fetch(REMOTE_URL, { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        if (j && typeof j === 'object') remote = j;
      }
    } catch (e) {
      console.warn('[overrides] remote fetch failed', e);
    } finally {
      remoteFetched = true;
      window.dispatchEvent(new CustomEvent('admin-overrides-changed'));
    }
  })();
  return remoteFetchPromise;
}

export function getRemote(): Overrides { return remote; }

// ---------- CACHE (in-memory merged view: remote + local) ----------

let cache: Overrides = mergeOverrides(remote, loadLocal());

function mergeOverrides(base: Overrides, top: Overrides): Overrides {
  const books = { ...(base.books || {}) };
  if (top.books) {
    for (const id of Object.keys(top.books)) {
      books[id] = { ...(books[id] || {}), ...top.books[id] };
    }
  }
  return { books };
}

function recomputeCache() {
  cache = mergeOverrides(remote, loadLocal());
}

// Recompute on remote arrival / local change / cross-tab change
if (typeof window !== 'undefined') {
  window.addEventListener('admin-overrides-changed', recomputeCache);
  window.addEventListener('storage', e => {
    if (e.key === LOCAL_KEY) {
      recomputeCache();
      window.dispatchEvent(new CustomEvent('admin-overrides-changed'));
    }
  });
}

// ---------- PUBLIC API ----------

export function getOverrides(): Overrides { return cache; }

export function setBookOverride(id: string, patch: BookOverride) {
  const local = loadLocal();
  const current = local.books?.[id] || {};
  const merged: BookOverride = { ...current, ...patch };
  // strip empty strings so the original (or remote) value shines through
  (Object.keys(merged) as (keyof BookOverride)[]).forEach(k => {
    const v = merged[k];
    if (v === undefined || v === '') delete merged[k];
  });
  const nextBooks = { ...(local.books || {}) };
  if (Object.keys(merged).length === 0) delete nextBooks[id];
  else nextBooks[id] = merged;
  saveLocal({ ...local, books: nextBooks });
}

export function resetBookOverride(id: string) {
  const local = loadLocal();
  if (!local.books?.[id]) return;
  const nextBooks = { ...local.books };
  delete nextBooks[id];
  saveLocal({ ...local, books: nextBooks });
}

export function resetAllLocal() { saveLocal({}); }

export function exportJSON(): string { return JSON.stringify(loadLocal(), null, 2); }

export function importJSON(text: string): { ok: boolean; error?: string } {
  try {
    const o = JSON.parse(text);
    if (typeof o !== 'object' || o === null) throw new Error('Object байх ёстой');
    saveLocal(o);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e.message || e) };
  }
}

// Build the merged-to-publish JSON: remote ⊕ local
export function buildMergedJSON(): string {
  return JSON.stringify(mergeOverrides(remote, loadLocal()), null, 2);
}

export function getLocalOnly(): Overrides { return loadLocal(); }

// React hook: returns the current merged view, recomputes on changes
export function useOverrides(): Overrides {
  const [o, setO] = useState<Overrides>(cache);
  useEffect(() => {
    const update = () => setO({ ...cache });
    window.addEventListener('admin-overrides-changed', update);
    return () => window.removeEventListener('admin-overrides-changed', update);
  }, []);
  return o;
}

// True only when the admin has unpublished local edits that differ from remote.
export function useHasLocalDiff(): boolean {
  const o = useOverrides();
  void o; // re-render trigger
  const local = loadLocal();
  const localBooks = local.books || {};
  const remoteBooks = remote.books || {};
  const ids = new Set([...Object.keys(localBooks), ...Object.keys(remoteBooks)]);
  for (const id of ids) {
    const l = JSON.stringify(localBooks[id] || {});
    const r = JSON.stringify(remoteBooks[id] || {});
    if (l !== r) return true;
  }
  return false;
}

export function applyBookOverride<T extends { id: string }>(book: T, overrides: Overrides): T {
  const o = overrides.books?.[book.id];
  return o ? { ...book, ...o } : book;
}
