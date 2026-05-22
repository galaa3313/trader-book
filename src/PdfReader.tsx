import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2,
  Bookmark, Languages, Loader2, FileText, RotateCw
} from 'lucide-react';
import type { BookMeta, BookLang } from './data/books';

// Worker setup — try bundled, fall back to CDN
try {
  // @ts-ignore vite ?url
  import('pdfjs-dist/build/pdf.worker.min.mjs?url').then((m: any) => {
    pdfjs.GlobalWorkerOptions.workerSrc = m.default;
  }).catch(() => {
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  });
} catch {
  pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

type TranslationState = 'idle' | 'loading' | 'ok' | 'error' | 'empty';

const PROGRESS_KEY = (id: string) => `pdfprogress:${id}`;
const PREF_LANG_KEY = 'pdfreader:preferredLang';
const TRANS_KEY = (id: string, page: number, lang: BookLang) =>
  `pdftrans:v1:${id}:p${page}:${lang}`;

export default function PdfReader({ book, onClose }: { book: BookMeta; onClose: () => void }) {
  const url = `/books/${encodeURIComponent(book.file)}`;
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(PROGRESS_KEY(book.id)) || '1', 10) || 1; } catch { return 1; }
  });
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [docError, setDocError] = useState<string | null>(null);

  // Language: 'original' shows PDF; non-original shows AI translation
  const otherLang: BookLang = book.language === 'en' ? 'mn' : 'en';
  const [activeLang, setActiveLang] = useState<BookLang>(() => {
    try {
      const saved = localStorage.getItem(PREF_LANG_KEY) as BookLang | null;
      return saved === 'en' || saved === 'mn' ? saved : book.language;
    } catch { return book.language; }
  });
  useEffect(() => { try { localStorage.setItem(PREF_LANG_KEY, activeLang); } catch {} }, [activeLang]);

  // Translation state for current page
  const [transStatus, setTransStatus] = useState<TranslationState>('idle');
  const [transText, setTransText] = useState<string>('');
  const [transError, setTransError] = useState<string>('');

  // Reader settings
  const [fontSize, setFontSize] = useState<number>(18);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const pdfDocRef = useRef<any>(null);

  // Save progress
  useEffect(() => {
    try { localStorage.setItem(PROGRESS_KEY(book.id), String(pageNum)); } catch {}
  }, [book.id, pageNum]);

  // Bookmarks per book
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`bookmarks:${book.id}`);
      if (raw) setBookmarks(new Set(JSON.parse(raw)));
    } catch {}
  }, [book.id]);
  const toggleBookmark = useCallback(() => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(pageNum)) next.delete(pageNum); else next.add(pageNum);
      try { localStorage.setItem(`bookmarks:${book.id}`, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [pageNum, book.id]);

  // Extract text + translate when activeLang != book.language
  const showTranslation = activeLang !== book.language;

  const extractAndTranslate = useCallback(async () => {
    if (!showTranslation || !pdfDocRef.current) { setTransStatus('idle'); return; }

    // 1. Check localStorage cache
    try {
      const cached = localStorage.getItem(TRANS_KEY(book.id, pageNum, activeLang));
      if (cached) {
        setTransText(cached);
        setTransStatus('ok');
        return;
      }
    } catch {}

    setTransStatus('loading');
    setTransError('');

    try {
      // 2. Extract page text via pdf.js
      const page = await pdfDocRef.current.getPage(pageNum);
      const content = await page.getTextContent();
      const text = (content.items as any[]).map(i => i.str).join(' ').replace(/\s+/g, ' ').trim();

      if (!text || text.length < 5) {
        setTransStatus('empty');
        setTransText('');
        return;
      }

      // 3. Send to /api/translate
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.slice(0, 25000),
          fromLang: book.language,
          toLang: activeLang,
          bookTitle: book.titleEn,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      if (!data.translation) throw new Error('Empty translation');

      setTransText(data.translation);
      setTransStatus('ok');
      try { localStorage.setItem(TRANS_KEY(book.id, pageNum, activeLang), data.translation); } catch {}
    } catch (e: any) {
      console.error('Translation failed', e);
      setTransError(String(e.message || e));
      setTransStatus('error');
    }
  }, [showTranslation, book, pageNum, activeLang]);

  useEffect(() => { extractAndTranslate(); }, [extractAndTranslate]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === ' ') setPageNum(p => Math.min(numPages || 1, p + 1));
      else if (e.key === 'ArrowLeft') setPageNum(p => Math.max(1, p - 1));
      else if (e.key === '+' || e.key === '=') setScale(s => Math.min(3, +(s + 0.1).toFixed(2)));
      else if (e.key === '-' || e.key === '_') setScale(s => Math.max(0.5, +(s - 0.1).toFixed(2)));
      else if (e.key.toLowerCase() === 'b') toggleBookmark();
      else if (e.key.toLowerCase() === 'l') setActiveLang(prev => prev === book.language ? otherLang : book.language);
      else if (e.key.toLowerCase() === 'f') {
        const el = document.documentElement;
        if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [numPages, onClose, toggleBookmark, book.language, otherLang]);

  const progressPct = numPages ? (pageNum / numPages) * 100 : 0;
  const isBookmarked = bookmarks.has(pageNum);

  const pageOptions = useMemo(() => ({
    // pdf.js render quality
    renderTextLayer: !showTranslation,
    renderAnnotationLayer: !showTranslation,
  }), [showTranslation]);

  return (
    <div className="fixed inset-0 z-50 bg-ink-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-ink-700 bg-ink-900/70 backdrop-blur">
        <button onClick={onClose} title="Хаах (Esc)"
          className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-neon-red/15 hover:text-neon-red text-ink-200 flex items-center justify-center">
          <X size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-white text-sm truncate">{book.titleMn}</div>
          <div className="text-[10px] text-ink-400 truncate">{book.titleEn !== book.titleMn ? book.titleEn : (book.authorMn || book.authorEn || 'PDF')}</div>
        </div>

        {/* Language toggle pill */}
        <div className="flex items-center bg-ink-800 rounded-full p-0.5 border border-ink-700">
          {(['en','mn'] as BookLang[]).map(lang => {
            const active = activeLang === lang;
            const isOriginal = lang === book.language;
            return (
              <button key={lang}
                onClick={() => setActiveLang(lang)}
                title={isOriginal ? 'Эх хувилбар' : 'AI орчуулсан'}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                  active
                    ? 'bg-gradient-to-r from-neon-green to-neon-cyan text-ink-950 shadow-glow-green'
                    : 'text-ink-300 hover:text-white'
                }`}>
                {lang === 'en' ? '🇬🇧 EN' : '🇲🇳 MN'}
                {!isOriginal && active && <span className="text-[8px]">🤖</span>}
              </button>
            );
          })}
        </div>

        {/* Compact controls */}
        <div className="hidden sm:flex items-center gap-1">
          <button onClick={() => setScale(s => Math.max(0.5, +(s - 0.1).toFixed(2)))} title="Жижигрүүлэх (-)"
            className="w-8 h-8 rounded bg-ink-800 hover:bg-ink-700 text-ink-300 flex items-center justify-center"><ZoomOut size={14}/></button>
          <span className="text-[10px] font-mono text-ink-400 w-10 text-center">{Math.round(scale*100)}%</span>
          <button onClick={() => setScale(s => Math.min(3, +(s + 0.1).toFixed(2)))} title="Томруулах (+)"
            className="w-8 h-8 rounded bg-ink-800 hover:bg-ink-700 text-ink-300 flex items-center justify-center"><ZoomIn size={14}/></button>
          <button onClick={() => setRotation(r => (r + 90) % 360)} title="Эргүүлэх"
            className="w-8 h-8 rounded bg-ink-800 hover:bg-ink-700 text-ink-300 flex items-center justify-center"><RotateCw size={14}/></button>
          <button onClick={toggleBookmark} title="Хавчуурга (B)"
            className={`w-8 h-8 rounded flex items-center justify-center transition-all ${isBookmarked ? 'bg-neon-amber/20 text-neon-amber' : 'bg-ink-800 text-ink-300 hover:bg-ink-700'}`}>
            <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'}/>
          </button>
          <button title="Бүтэн дэлгэц (F)" onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.();
            }}
            className="w-8 h-8 rounded bg-ink-800 hover:bg-ink-700 text-ink-300 flex items-center justify-center"><Maximize2 size={14}/></button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-ink-900">
        <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto bg-ink-900 flex items-start justify-center p-3 sm:p-6">
        {docError ? (
          <div className="text-center text-ink-300 py-12 max-w-md">
            <FileText size={32} className="mx-auto mb-3 text-neon-red" />
            <div className="font-bold text-white mb-1">PDF ачаалж чадсангүй</div>
            <div className="text-xs text-ink-400">{docError}</div>
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-neon-cyan/15 border border-neon-cyan/40 text-neon-cyan rounded-lg text-xs font-bold">
              Шинэ tab-д нээх
            </a>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={(d: any) => { setNumPages(d.numPages); pdfDocRef.current = d; setDocError(null); }}
            onLoadError={(e: any) => setDocError(String(e.message || e))}
            loading={
              <div className="text-ink-300 py-12 text-center">
                <Loader2 size={28} className="mx-auto mb-2 animate-spin text-neon-cyan" />
                <div className="text-xs">PDF ачаалж байна... ({book.fileSizeMB} MB)</div>
              </div>
            }
            error={<div className="text-neon-red">PDF алдаатай</div>}
          >
            {showTranslation ? (
              <div className="max-w-3xl mx-auto bg-ink-950 rounded-xl border border-ink-700 p-6 sm:p-10"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.75 }}>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ink-700">
                  <span className="px-2 py-0.5 bg-neon-green/15 text-neon-green text-[10px] font-bold rounded">🤖 AI орчуулсан</span>
                  <span className="text-[10px] text-ink-400">Хуудас {pageNum} · {activeLang === 'en' ? 'English' : 'Монгол'}</span>
                  <button onClick={() => { try { localStorage.removeItem(TRANS_KEY(book.id, pageNum, activeLang)); } catch {}; extractAndTranslate(); }}
                    title="Дахин орчуулах"
                    className="ml-auto text-[10px] text-ink-400 hover:text-neon-cyan">↻ дахин</button>
                </div>

                {transStatus === 'loading' && (
                  <div className="py-12 text-center text-ink-300">
                    <Loader2 size={28} className="mx-auto mb-3 animate-spin text-neon-cyan" />
                    <div className="text-sm">Орчуулж байна... <span className="text-ink-500">(анх удаа ~10-30 секунд)</span></div>
                    <div className="text-[10px] text-ink-500 mt-1">Claude {''}<code>claude-sonnet-4-6</code></div>
                  </div>
                )}
                {transStatus === 'error' && (
                  <div className="py-8 text-center">
                    <div className="text-neon-red font-bold mb-2">⚠ Орчуулга амжилтгүй</div>
                    <div className="text-xs text-ink-400 mb-3">{transError}</div>
                    <button onClick={extractAndTranslate}
                      className="px-3 py-1.5 bg-neon-cyan/15 border border-neon-cyan/40 text-neon-cyan rounded text-xs font-bold">↻ Дахин оролдох</button>
                  </div>
                )}
                {transStatus === 'empty' && (
                  <div className="py-12 text-center text-ink-400">
                    <FileText size={28} className="mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Энэ хуудсаас текст олдсонгүй</div>
                    <div className="text-[10px] mt-1">(Сканнердсан/зурагт хуудас байж магадгүй)</div>
                  </div>
                )}
                {transStatus === 'ok' && (
                  <div className="text-ink-100 font-serif whitespace-pre-wrap" style={{ fontFamily: '"Crimson Pro", "Source Serif Pro", Georgia, serif' }}>
                    {transText}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-md shadow-lg overflow-hidden">
                <Page pageNumber={pageNum} scale={scale} rotate={rotation} {...pageOptions} />
              </div>
            )}
          </Document>
        )}
      </div>

      {/* Footer pagination */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-t border-ink-700 bg-ink-900/70 backdrop-blur">
        <button onClick={() => setPageNum(p => Math.max(1, p - 1))} disabled={pageNum <= 1}
          className="px-3 py-2 bg-ink-800 hover:bg-ink-700 disabled:opacity-30 disabled:cursor-not-allowed text-ink-200 rounded-lg flex items-center gap-1 text-sm">
          <ChevronLeft size={16} /> <span className="hidden sm:inline">Өмнөх</span>
        </button>

        <div className="flex-1 flex items-center justify-center gap-2">
          <input type="number" min={1} max={numPages || 1} value={pageNum}
            onChange={e => { const v = parseInt(e.target.value, 10); if (v >= 1 && v <= (numPages || 1)) setPageNum(v); }}
            className="w-14 px-2 py-1 bg-ink-800 border border-ink-700 rounded text-center font-mono text-white text-sm focus:border-neon-cyan outline-none"/>
          <span className="text-ink-400 text-sm">/ <span className="font-mono">{numPages || '…'}</span></span>
        </div>

        {/* Font size for translation */}
        {showTranslation && (
          <div className="hidden sm:flex items-center gap-1 mr-2">
            <button onClick={() => setFontSize(f => Math.max(12, f - 2))} title="A-"
              className="w-7 h-7 rounded bg-ink-800 hover:bg-ink-700 text-ink-300 text-xs">A-</button>
            <button onClick={() => setFontSize(f => Math.min(28, f + 2))} title="A+"
              className="w-7 h-7 rounded bg-ink-800 hover:bg-ink-700 text-ink-300 text-sm">A+</button>
          </div>
        )}

        <button onClick={() => setPageNum(p => Math.min(numPages || 1, p + 1))} disabled={pageNum >= (numPages || 1)}
          className="px-3 py-2 bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-950 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed font-bold rounded-lg flex items-center gap-1 text-sm">
          <span className="hidden sm:inline">Дараах</span> <ChevronRight size={16} />
        </button>
      </div>

      {/* Keyboard shortcut hints (desktop only) */}
      <div className="hidden lg:flex items-center justify-center gap-3 text-[10px] text-ink-500 py-1 border-t border-ink-800 bg-ink-950">
        <span>← → хуудас</span>
        <span>L хэл</span>
        <span>B хавчуурга</span>
        <span>F бүтэн дэлгэц</span>
        <span>+/− zoom</span>
        <span>Esc хаах</span>
      </div>
    </div>
  );
}
