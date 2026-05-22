import { useEffect, useState, useRef } from 'react';

// Lazy-loaded pdfjs to keep main bundle small
let pdfjsPromise: Promise<any> | null = null;
async function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import('pdfjs-dist');
      try {
        // @ts-ignore - Vite handles the ?url suffix at build time
        const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      } catch {
        pdfjs.GlobalWorkerOptions.workerSrc =
          `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      }
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

const CACHE_VERSION = 'v1';
const STORAGE_KEY = (file: string) => `bookcover:${CACHE_VERSION}:${file}`;

export type CoverStatus = 'idle' | 'loading' | 'ok' | 'error';

/**
 * Renders page 1 of a PDF and returns a data-URL cover image.
 * Caches result in localStorage so subsequent visits are instant.
 */
export function useBookCover(file: string, scale = 0.6) {
  const [cover, setCover] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY(file)); } catch { return null; }
  });
  const [status, setStatus] = useState<CoverStatus>(cover ? 'ok' : 'idle');
  const [pageCount, setPageCount] = useState<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (cover || startedRef.current) return;
    startedRef.current = true;
    setStatus('loading');
    let cancelled = false;

    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const url = `/books/${encodeURIComponent(file)}`;
        const doc = await pdfjs.getDocument({ url, disableRange: false, disableStream: false }).promise;
        if (cancelled) return;
        setPageCount(doc.numPages);

        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No 2D context');
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        if (cancelled) return;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
        setCover(dataUrl);
        setStatus('ok');
        try { localStorage.setItem(STORAGE_KEY(file), dataUrl); } catch {
          // localStorage quota — silently ignore
        }
      } catch (e) {
        console.error('[BookCover] failed for', file, e);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, [file, scale, cover]);

  return { cover, status, pageCount };
}
