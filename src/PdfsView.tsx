import { useMemo, useState, lazy, Suspense } from 'react';
import { BookOpen, FileText, Clock, Download, Pencil } from 'lucide-react';
import { BOOKS, BOOK_TOPICS, type BookMeta, type BookLang, type BookDifficulty } from './data/books';
import { useBookCover } from './useBookCover';
import { useAuth } from './auth/AuthContext';
import { useOverrides, applyBookOverride } from './admin/overrides';

const PdfReader = lazy(() => import('./PdfReader'));

type LangFilter = 'all' | BookLang;
type DiffFilter = 'all' | BookDifficulty;

const ACCENT: Record<string, { bg: string; ring: string; text: string; glow: string }> = {
  cyan:   { bg: 'from-neon-cyan/20 to-neon-cyan/0',     ring: 'border-neon-cyan/40',   text: 'text-neon-cyan',   glow: 'hover:shadow-glow-cyan' },
  green:  { bg: 'from-neon-green/20 to-neon-green/0',   ring: 'border-neon-green/40',  text: 'text-neon-green',  glow: 'hover:shadow-glow-green' },
  violet: { bg: 'from-neon-violet/20 to-neon-violet/0', ring: 'border-neon-violet/40', text: 'text-neon-violet', glow: 'hover:shadow-glow-violet' },
  amber:  { bg: 'from-neon-amber/20 to-neon-amber/0',   ring: 'border-neon-amber/40',  text: 'text-neon-amber',  glow: 'hover:shadow-glow-cyan' },
  red:    { bg: 'from-neon-red/20 to-neon-red/0',       ring: 'border-neon-red/40',    text: 'text-neon-red',    glow: 'hover:shadow-glow-red' },
  pink:   { bg: 'from-neon-pink/20 to-neon-pink/0',     ring: 'border-neon-pink/40',   text: 'text-neon-pink',   glow: 'hover:shadow-glow-violet' },
};

const DIFF_META: Record<BookDifficulty, { en: string; mn: string; icon: string; color: string }> = {
  beginner:     { en: 'Beginner',     mn: 'Анхан шат',  icon: '🌱', color: 'text-neon-green' },
  intermediate: { en: 'Intermediate', mn: 'Дунд шат',   icon: '⚡', color: 'text-neon-amber' },
  advanced:     { en: 'Advanced',     mn: 'Гүнзгий',    icon: '🔥', color: 'text-neon-red' },
};

const LANG_META: Record<BookLang, { flag: string; label: string }> = {
  en: { flag: '🇬🇧', label: 'EN' },
  mn: { flag: '🇲🇳', label: 'MN' },
};

function CoverImage({ file, title, accent }: { file: string; title: string; accent: string }) {
  const { cover, status } = useBookCover(file, 0.7);
  const acc = ACCENT[accent] || ACCENT.cyan;

  return (
    <div className={`relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br ${acc.bg} bg-ink-900/60 border ${acc.ring}`}>
      {cover ? (
        <img src={cover} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
      ) : status === 'loading' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 border-2 border-ink-600 border-t-neon-cyan rounded-full animate-spin" />
            <div className="text-[10px] text-ink-400 uppercase tracking-wider">Cover...</div>
          </div>
        </div>
      ) : status === 'error' ? (
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="text-center">
            <BookOpen size={28} className={`mx-auto mb-2 ${acc.text}`} />
            <div className="text-[10px] text-ink-400">PDF</div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen size={28} className={`${acc.text} opacity-50`} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}

function BookCard({ book, onOpen, onEdit, isAdmin, progress }: { book: BookMeta; onOpen: (b: BookMeta) => void; onEdit?: () => void; isAdmin: boolean; progress?: number }) {
  const acc = ACCENT[book.accentColor || 'cyan'] || ACCENT.cyan;
  const diff = DIFF_META[book.difficulty];
  const lang = LANG_META[book.language];
  const url = `/books/${encodeURIComponent(book.file)}`;

  return (
    <div className={`group glass rounded-2xl p-4 flex flex-col transition-all ${acc.glow} hover:border-neon-cyan/30`}>
      {/* Cover */}
      <div className="mb-3">
        <CoverImage file={book.file} title={book.titleEn} accent={book.accentColor || 'cyan'} />
      </div>

      {/* Badges row */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border bg-ink-900/60 ${acc.ring} ${acc.text}`}>
          {lang.flag} {lang.label}
        </span>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-ink-800 ${diff.color}`}>
          {diff.icon} {diff.mn}
        </span>
        {book.estimatedHours && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-ink-800 text-ink-300">
            <Clock size={9} /> {book.estimatedHours}ц
          </span>
        )}
      </div>

      {/* Titles */}
      <div className="mb-2">
        <h3 className="font-display font-bold text-white text-sm leading-tight">{book.titleMn}</h3>
        {book.titleEn !== book.titleMn && (
          <div className="text-[11px] text-ink-400 italic mt-0.5">{book.titleEn}</div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-ink-300 leading-relaxed mb-3 line-clamp-3 flex-1">{book.descMn}</p>

      {/* Topics */}
      {book.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {book.topics.slice(0, 3).map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-ink-800/60 text-ink-400 border border-ink-700">
              {BOOK_TOPICS[t]?.mn || t}
            </span>
          ))}
        </div>
      )}

      {/* Progress (Phase 2 will wire this) */}
      {progress !== undefined && progress > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-[9px] uppercase tracking-wider text-ink-400 mb-1">
            <span>Уншилт</span><span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-ink-800 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-neon-cyan to-neon-violet`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onOpen(book)}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all bg-gradient-to-r ${acc.bg} ${acc.ring} ${acc.text} hover:bg-ink-800`}
        >
          <BookOpen size={14} /> Унших
        </button>
        {/* Download — admin only. Guests cannot download/save the PDF file. */}
        {isAdmin && (
          <a
            href={url}
            download={book.file}
            title="Татаж авах (зөвхөн админ)"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-ink-800 border border-ink-700 hover:border-neon-cyan/40 hover:text-neon-cyan text-ink-300 transition-all"
          >
            <Download size={14} />
          </a>
        )}
        {isAdmin && onEdit && (
          <button
            onClick={onEdit}
            title="Засах"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-neon-amber/15 border border-neon-amber/40 text-neon-amber hover:bg-neon-amber/25 transition-all"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      {/* File size — admin only (users don't need to know the PDF size since they can't download) */}
      {isAdmin && book.fileSizeMB && (
        <div className="text-[9px] text-ink-500 text-right mt-1.5">{book.fileSizeMB} MB</div>
      )}
    </div>
  );
}

export default function PdfsView({ onOpenAdmin }: { onOpenAdmin?: () => void } = {}) {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const overrides = useOverrides();

  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [diffFilter, setDiffFilter] = useState<DiffFilter>('all');
  const [search, setSearch] = useState('');
  const [readingBook, setReadingBook] = useState<BookMeta | null>(null);

  // Apply admin overrides (title/desc renames) on top of the static catalog
  const effectiveBooks = useMemo(
    () => BOOKS.map(b => applyBookOverride(b, overrides)),
    [overrides]
  );

  const filtered = useMemo(() => {
    return effectiveBooks.filter(b => {
      if (langFilter !== 'all' && b.language !== langFilter) return false;
      if (diffFilter !== 'all' && b.difficulty !== diffFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const blob = `${b.titleEn} ${b.titleMn} ${b.descEn} ${b.descMn} ${b.topics.join(' ')}`.toLowerCase();
        if (!blob.includes(s)) return false;
      }
      return true;
    });
  }, [effectiveBooks, langFilter, diffFilter, search]);

  const langFilters: { id: LangFilter; label: string }[] = [
    { id: 'all', label: `📚 Бүх ном (${BOOKS.length})` },
    { id: 'en',  label: `🇬🇧 Англи (${BOOKS.filter(b => b.language === 'en').length})` },
    { id: 'mn',  label: `🇲🇳 Монгол (${BOOKS.filter(b => b.language === 'mn').length})` },
  ];
  const diffFilters: { id: DiffFilter; label: string }[] = [
    { id: 'all',          label: 'Бүх түвшин' },
    { id: 'beginner',     label: '🌱 Анхан' },
    { id: 'intermediate', label: '⚡ Дунд' },
    { id: 'advanced',     label: '🔥 Гүнзгий' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-neon-violet/15 text-neon-violet flex items-center justify-center">
          <FileText size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">PDF Номын Сан</h1>
          <p className="text-xs text-ink-400">{BOOKS.length} ном · Англи + Монгол · Cover-ийг PDF-ээс автоматаар үүсгэв</p>
        </div>
        {isAdmin && onOpenAdmin && (
          <button onClick={onOpenAdmin}
            title="Админ самбар нээх"
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-neon-amber/15 border border-neon-amber/40 text-neon-amber hover:bg-neon-amber/25">
            <Pencil size={12} /> Засварлах
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {langFilters.map(f => (
          <button key={f.id} onClick={() => setLangFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              langFilter === f.id ? 'bg-neon-violet/15 text-neon-violet border border-neon-violet/40' : 'glass text-ink-300 hover:text-white'
            }`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {diffFilters.map(f => (
          <button key={f.id} onClick={() => setDiffFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              diffFilter === f.id ? 'bg-neon-amber/15 text-neon-amber border border-neon-amber/40' : 'glass text-ink-300 hover:text-white'
            }`}>
            {f.label}
          </button>
        ))}
        <div className="relative flex-1 min-w-[160px]">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Хайх... (нэр, сэдэв)"
            className="w-full px-3 py-1.5 glass rounded-lg text-white text-sm outline-none focus:border-neon-cyan" />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-400">📭 Шүүлтэнд тохирох ном алга</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onOpen={setReadingBook}
              isAdmin={isAdmin}
              onEdit={isAdmin && onOpenAdmin ? onOpenAdmin : undefined}
            />
          ))}
        </div>
      )}

      <div className="mt-6 p-3 rounded-xl bg-ink-900/40 border border-ink-700 text-xs text-ink-400 space-y-1">
        <div className="font-bold text-ink-200 mb-1">💡 Тайлбар</div>
        <div>• Cover автомат үүсгэгдэнэ — PDF-ийн 1-р хуудаснаас (pdf.js), эхний удаа удаан, дараа localStorage cache</div>
        <div>• "Унших" товч → дотоод PDF reader нээнэ (шинэ tab биш)</div>
        <div>• Reader дотор 🇬🇧 EN / 🇲🇳 MN <strong>хэлний toggle</strong> — өөр хэл сонгоход автомат орчуулга</div>
        <div className="ml-3">↳ <span className="text-neon-cyan">🌐 Google</span> — Default, ҮНЭГҮЙ, хурдан (~1-3 сек), чанар дунд зэрэг</div>
        <div className="ml-3">↳ <span className="text-neon-green">✨ Claude</span> — "Чанартай" товчоор шилжих, ~$0.01-0.02/хуудас, форекс нэр томьёог зөв буулгана</div>
        <div>• Хуудас тус бүрийн орчуулга <strong>localStorage cache</strong>-д хадгалагдана — дахин үнэгүй</div>
        <div>• Keyboard: <kbd className="px-1 py-0.5 bg-ink-800 rounded text-neon-cyan">←→</kbd> хуудас · <kbd className="px-1 py-0.5 bg-ink-800 rounded text-neon-cyan">L</kbd> хэл · <kbd className="px-1 py-0.5 bg-ink-800 rounded text-neon-cyan">B</kbd> хавчуурга · <kbd className="px-1 py-0.5 bg-ink-800 rounded text-neon-cyan">F</kbd> бүтэн дэлгэц</div>
      </div>

      {readingBook && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-ink-950 flex items-center justify-center text-ink-300">PDF reader ачаалж байна...</div>}>
          <PdfReader book={readingBook} onClose={() => setReadingBook(null)} />
        </Suspense>
      )}
    </div>
  );
}

