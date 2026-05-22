import { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { pdfjs } from 'react-pdf';
import {
  X, ChevronLeft, ChevronRight, Loader2, FileText, Bookmark, BookOpen, Maximize2,
} from 'lucide-react';
import type { BookMeta } from './data/books';

// Reuse worker setup from PdfReader
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

const PROGRESS_KEY = (id: string) => `pdfprogress:${id}`;
const RENDER_SCALE = 1.4;
const RENDER_AHEAD = 3;
const RENDER_BEHIND = 1;

// Each "page" in HTMLFlipBook must be a forwarded-ref element.
type PageProps = { pageNum: number; dataUrl?: string; isCover?: boolean; title?: string; subtitle?: string; bg?: string };
const FlipPage = forwardRef<HTMLDivElement, PageProps>(({ pageNum, dataUrl, isCover, title, subtitle, bg }, ref) => {
  return (
    <div
      ref={ref}
      className="flip-page"
      data-density={isCover ? 'hard' : 'soft'}
      style={{
        background: isCover ? (bg || 'linear-gradient(135deg, #0A0E1A 0%, #1F2940 100%)') : '#fdf6e3',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      }}
    >
      {isCover ? (
        <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 text-white">
          <BookOpen size={42} className="mb-4 opacity-90" />
          <div className="text-2xl font-display font-bold mb-2 leading-tight">{title}</div>
          {subtitle && <div className="text-sm opacity-70 italic">{subtitle}</div>}
          <div className="mt-auto text-[10px] opacity-50 uppercase tracking-widest">Trading 101 Academy</div>
        </div>
      ) : dataUrl ? (
        <img
          src={dataUrl}
          alt={`Хуудас ${pageNum}`}
          draggable={false}
          onContextMenu={e => e.preventDefault()}
          className="w-full h-full object-contain bg-white select-none pointer-events-none"
        />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-ink-500">
          <Loader2 size={28} className="animate-spin mb-2 text-neon-cyan" />
          <div className="text-xs">Хуудас {pageNum}</div>
        </div>
      )}
    </div>
  );
});
FlipPage.displayName = 'FlipPage';

export default function PageFlipReader({ book, onClose }: { book: BookMeta; onClose: () => void }) {
  const url = `/books/${encodeURIComponent(book.file)}`;
  const flipRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [docError, setDocError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(PROGRESS_KEY(book.id)) || '1', 10) || 1; } catch { return 1; }
  });
  const [renderedPages, setRenderedPages] = useState<Map<number, string>>(new Map());
  const [, force] = useState(0);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 500, h: 700 });

  // Responsive sizing
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - 120; // leave room for header/footer
      // Aim for ~0.71 aspect (A4-ish portrait)
      let w = Math.min(520, vw / 2 - 32);
      if (vw < 760) w = Math.min(vw - 32, 480); // single page mode on small screens
      let h = w / 0.71;
      if (h > vh) { h = vh; w = h * 0.71; }
      setSize({ w: Math.floor(w), h: Math.floor(h) });
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Open PDF
  useEffect(() => {
    let cancelled = false;
    setDocError(null);
    (async () => {
      try {
        const task = pdfjs.getDocument(url);
        const doc = await task.promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
      } catch (e: any) {
        if (!cancelled) setDocError(String(e.message || e));
      }
    })();
    return () => { cancelled = true; };
  }, [url]);

  // Render single page to data URL
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc) return;
    if (renderedPages.has(pageNum)) return;
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: RENDER_SCALE });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setRenderedPages(prev => {
        if (prev.has(pageNum)) return prev;
        const next = new Map(prev);
        next.set(pageNum, dataUrl);
        return next;
      });
    } catch (e) {
      console.warn('Render failed page', pageNum, e);
    }
  }, [pdfDoc, renderedPages]);

  // Render pages near current
  useEffect(() => {
    if (!pdfDoc) return;
    const start = Math.max(1, currentPage - RENDER_BEHIND);
    const end = Math.min(numPages, currentPage + RENDER_AHEAD);
    (async () => {
      for (let i = start; i <= end; i++) {
        await renderPage(i);
        force(x => x + 1);
      }
    })();
  }, [pdfDoc, currentPage, numPages, renderPage]);

  // Save progress
  useEffect(() => {
    try { localStorage.setItem(PROGRESS_KEY(book.id), String(currentPage)); } catch {}
  }, [book.id, currentPage]);

  // Jump to saved progress once the book is loaded
  useEffect(() => {
    if (numPages > 0 && flipRef.current && currentPage > 1) {
      // Wait a tick — flipbook needs to mount its children first
      const id = setTimeout(() => {
        try { flipRef.current?.pageFlip()?.turnToPage(currentPage - 1); } catch {}
      }, 250);
      return () => clearTimeout(id);
    }
  }, [numPages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Block guest copy/save/print
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === 's' || k === 'p' || k === 'a' || k === 'c' || k === 'u') { e.preventDefault(); return; }
      }
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === ' ') flipRef.current?.pageFlip()?.flipNext();
      else if (e.key === 'ArrowLeft') flipRef.current?.pageFlip()?.flipPrev();
      else if (e.key.toLowerCase() === 'f') {
        const el = document.documentElement;
        if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onFlip = (e: any) => {
    // e.data is the 0-based page index of the LEFT page in landscape mode.
    // For "current page" we add 1 (and another +1 if in landscape, but for simplicity treat as the right page).
    const idx = typeof e?.data === 'number' ? e.data : 0;
    setCurrentPage(idx + 1);
  };

  const goPrev = () => flipRef.current?.pageFlip()?.flipPrev();
  const goNext = () => flipRef.current?.pageFlip()?.flipNext();

  const progressPct = numPages ? (currentPage / numPages) * 100 : 0;

  // Build pages array: [cover, ...pdf pages, back cover]
  const accentBg = book.accentColor === 'amber' ? 'linear-gradient(135deg, #4A2D00 0%, #C08400 100%)' :
                   book.accentColor === 'green' ? 'linear-gradient(135deg, #003522 0%, #00A36C 100%)' :
                   book.accentColor === 'violet' ? 'linear-gradient(135deg, #2A0040 0%, #8A2BE2 100%)' :
                   book.accentColor === 'red'   ? 'linear-gradient(135deg, #3A0000 0%, #B22222 100%)' :
                   book.accentColor === 'pink'  ? 'linear-gradient(135deg, #3A002A 0%, #D147A3 100%)' :
                                                  'linear-gradient(135deg, #001E33 0%, #006FBC 100%)';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-ink-950 flex flex-col pdf-protected"
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-ink-700 bg-ink-900/70 backdrop-blur shrink-0">
        <button onClick={onClose} title="Хаах (Esc)"
          className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-neon-red/15 hover:text-neon-red text-ink-200 flex items-center justify-center">
          <X size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-white text-sm truncate">{book.titleMn}</div>
          <div className="text-[10px] text-ink-400 truncate">{book.titleEn !== book.titleMn ? book.titleEn : (book.authorMn || book.authorEn || 'PDF')}</div>
        </div>
        <button title="Бүтэн дэлгэц (F)" onClick={() => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.();
        }}
          className="w-9 h-9 rounded bg-ink-800 hover:bg-ink-700 text-ink-300 flex items-center justify-center">
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-ink-900 shrink-0">
        <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Book stage */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-gradient-to-b from-ink-900 to-ink-950 px-2 py-3 relative">
        {docError ? (
          <div className="text-center text-ink-300 max-w-md p-6">
            <FileText size={36} className="mx-auto mb-3 text-neon-red" />
            <div className="font-bold text-white mb-1">PDF ачаалж чадсангүй</div>
            <div className="text-xs text-ink-400 break-words">{docError}</div>
          </div>
        ) : !pdfDoc ? (
          <div className="text-center text-ink-300">
            <Loader2 size={36} className="mx-auto mb-3 animate-spin text-neon-cyan" />
            <div className="text-sm">Ном ачаалж байна...</div>
            <div className="text-[10px] text-ink-500 mt-1">{book.fileSizeMB ? `${book.fileSizeMB} MB` : ''}</div>
          </div>
        ) : (
          <>
            <button
              onClick={goPrev}
              aria-label="Өмнөх хуудас"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-ink-800/80 hover:bg-neon-cyan/20 hover:text-neon-cyan text-ink-200 items-center justify-center backdrop-blur"
            >
              <ChevronLeft size={20} />
            </button>
            <HTMLFlipBook
              ref={flipRef}
              width={size.w}
              height={size.h}
              size="fixed"
              minWidth={300}
              maxWidth={800}
              minHeight={400}
              maxHeight={1200}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={false}
              drawShadow={true}
              flippingTime={700}
              usePortrait={size.w < 480}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
              startPage={0}
              onFlip={onFlip}
              className="shadow-2xl"
              style={{ background: 'transparent' }}
            >
              {/* Front cover */}
              <FlipPage pageNum={0} isCover title={book.titleMn} subtitle={book.titleEn} bg={accentBg} />
              {/* PDF pages */}
              {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                <FlipPage key={p} pageNum={p} dataUrl={renderedPages.get(p)} />
              ))}
              {/* Back cover */}
              <FlipPage pageNum={numPages + 1} isCover title="Уншсанд баярлалаа" subtitle="Trading 101" bg={accentBg} />
            </HTMLFlipBook>
            <button
              onClick={goNext}
              aria-label="Дараах хуудас"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-ink-800/80 hover:bg-neon-cyan/20 hover:text-neon-cyan text-ink-200 items-center justify-center backdrop-blur"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-t border-ink-700 bg-ink-900/70 backdrop-blur shrink-0">
        <button onClick={goPrev}
          className="md:hidden px-3 py-2 bg-ink-800 hover:bg-ink-700 text-ink-200 rounded-lg flex items-center gap-1 text-sm">
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Bookmark size={12} className="text-neon-cyan" />
          <span className="font-mono text-xs text-ink-200">
            {currentPage} / {numPages || '...'}
          </span>
        </div>
        <button onClick={goNext}
          className="md:hidden px-3 py-2 bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-950 font-bold rounded-lg flex items-center gap-1 text-sm">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="hidden lg:flex items-center justify-center gap-3 text-[10px] text-ink-500 py-1 border-t border-ink-800 bg-ink-950 shrink-0">
        <span>← → хуудас сольж эргүүлэх</span>
        <span>F бүтэн дэлгэц</span>
        <span>Esc хаах</span>
        <span>хулганаар буланг чирэх боломжтой</span>
      </div>
    </div>
  );
}
