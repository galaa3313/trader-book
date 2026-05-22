import { useMemo, useState } from 'react';
import {
  Shield, LogOut, Save, RotateCcw, Download, Upload, Search, ChevronLeft, FileText,
  Globe, Github, Key, AlertCircle, CheckCircle, ExternalLink, Loader2,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { BOOKS, type BookMeta } from '../data/books';
import {
  useOverrides, setBookOverride, resetBookOverride, resetAllLocal, exportJSON, importJSON,
  buildMergedJSON, useHasLocalDiff,
} from './overrides';
import { getPat, setPat, getRepo, setRepo, publishOverridesViaGitHub } from './githubPublish';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { logout } = useAuth();
  const overrides = useOverrides();
  const hasLocalDiff = useHasLocalDiff();
  const [search, setSearch] = useState('');
  const [importText, setImportText] = useState('');
  const [importErr, setImportErr] = useState('');
  const [importOk, setImportOk] = useState(false);

  const books = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return BOOKS;
    return BOOKS.filter(b => {
      const ov = overrides.books?.[b.id] || {};
      const blob = `${ov.titleEn || b.titleEn} ${ov.titleMn || b.titleMn} ${b.id}`.toLowerCase();
      return blob.includes(s);
    });
  }, [search, overrides]);

  const overrideCount = Object.keys(overrides.books || {}).length;

  const doExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-overrides-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = () => {
    const r = importJSON(importText);
    if (r.ok) { setImportText(''); setImportErr(''); setImportOk(true); setTimeout(() => setImportOk(false), 1500); }
    else setImportErr(r.error || 'Import алдаатай');
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-950 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-ink-900/90 backdrop-blur border-b border-ink-700 px-3 sm:px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button onClick={onClose} title="Сайт руу буцах"
            className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-ink-700 text-ink-200 flex items-center justify-center">
            <ChevronLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/15 text-neon-cyan flex items-center justify-center">
            <Shield size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-white text-sm sm:text-base">Админ самбар</div>
            <div className="text-[10px] text-ink-400">
              {overrideCount} ном засагдсан{hasLocalDiff && ' · нийтлээгүй өөрчлөлттэй'}
            </div>
          </div>
          <button
            onClick={() => { if (confirm('Гарах уу?')) { logout(); onClose(); } }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neon-red/15 border border-neon-red/40 text-neon-red hover:bg-neon-red/25 flex items-center gap-1.5">
            <LogOut size={12} /> Гарах
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-3 sm:p-4 space-y-6">
        <PublishSection hasLocalDiff={hasLocalDiff} />

        <div className="glass rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mb-2">Backup / Restore (локал)</div>
          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={doExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neon-cyan/15 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/25">
              <Download size={12} /> JSON татах
            </button>
            <button onClick={() => { if (confirm('Локал бүх засварыг устгах уу? (Нийтлэгдсэн хувилбар хэвээрээ)')) resetAllLocal(); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neon-red/15 border border-neon-red/40 text-neon-red hover:bg-neon-red/25">
              <RotateCcw size={12} /> Локал бүгдийг устгах
            </button>
          </div>
          <details className="text-xs">
            <summary className="cursor-pointer text-ink-300 hover:text-white">JSON импортлох (paste)</summary>
            <textarea value={importText} onChange={e => setImportText(e.target.value)}
              placeholder='{"books":{"...":{...}}}'
              className="w-full mt-2 px-3 py-2 bg-ink-900/60 border border-ink-700 rounded-lg text-white font-mono text-xs h-24 outline-none focus:border-neon-cyan" />
            <div className="flex items-center gap-2 mt-2">
              <button onClick={doImport} disabled={!importText.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neon-green/15 border border-neon-green/40 text-neon-green disabled:opacity-40">
                <Upload size={12} /> Импортлох
              </button>
              {importOk && <span className="text-neon-green text-[11px]">✓ Амжилттай</span>}
              {importErr && <span className="text-neon-red text-[11px]">{importErr}</span>}
            </div>
          </details>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
              <FileText size={18} className="text-neon-violet" />
              Номын мета өгөгдөл
            </h2>
            <span className="text-[10px] text-ink-400">{books.length} / {BOOKS.length}</span>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Хайх (нэр, ID)..."
              className="w-full pl-9 pr-3 py-2 bg-ink-900/60 border border-ink-700 rounded-lg text-white outline-none focus:border-neon-cyan text-sm" />
          </div>
          <div className="space-y-3">
            {books.map(book => {
              const ov = overrides.books?.[book.id] || {};
              return <BookEditor key={book.id} original={book} ov={ov} />;
            })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-ink-900/40 border border-ink-700 text-xs text-ink-400 space-y-1">
          <div className="font-bold text-ink-200 mb-1">💡 Хэрхэн ажилладаг вэ?</div>
          <div>1. Энд номын нэр/тайлбарыг засна — <strong>локал</strong> хадгалагдана (зөвхөн чиний browser).</div>
          <div>2. <strong>"Нийтлэх"</strong> товчоор GitHub-руу commit хийнэ — Vercel автомат deploy хийнэ.</div>
          <div>3. ~30 секундын дараа бүх visitor шинэ хувилбарыг харна (cache no-store).</div>
          <div>4. GitHub token нь ЗӨВХӨН чиний browser-д хадгалагдана — серверт явахгүй.</div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// PUBLISH SECTION
// =========================================================================

function PublishSection({ hasLocalDiff }: { hasLocalDiff: boolean }) {
  const [pat, setPatLocal] = useState(getPat());
  const [repo, setRepoLocal] = useState(getRepo());
  const [showSetup, setShowSetup] = useState(!getPat());
  const [showToken, setShowToken] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<null | { ok: true; commitUrl: string } | { ok: false; error: string }>(null);

  const saveSetup = () => {
    setPat(pat.trim());
    setRepo(repo.trim() || 'galaa3313/trader-book');
    setShowSetup(false);
  };

  const doPublish = async () => {
    setPublishing(true);
    setResult(null);
    try {
      const json = buildMergedJSON();
      const r = await publishOverridesViaGitHub(json);
      setResult(r);
    } finally {
      setPublishing(false);
    }
  };

  const hasPat = !!getPat();
  const masked = pat ? `${pat.slice(0, 4)}…${pat.slice(-4)}` : '';

  return (
    <div className={`rounded-2xl p-4 border ${hasLocalDiff ? 'bg-neon-amber/10 border-neon-amber/40' : 'glass border-neon-green/30'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Globe size={16} className={hasLocalDiff ? 'text-neon-amber' : 'text-neon-green'} />
        <div className="flex-1">
          <div className="font-display font-bold text-white text-sm">Бодит сайт руу нийтлэх</div>
          <div className="text-[10px] text-ink-400">
            {hasLocalDiff ? '⚠ Хадгалагдаагүй өөрчлөлт байна' : '✓ Локал болон нийтлэгдсэн хувилбар адил'}
          </div>
        </div>
        {hasPat && (
          <button onClick={() => setShowSetup(s => !s)}
            className="text-[10px] text-ink-400 hover:text-neon-cyan inline-flex items-center gap-1">
            <Key size={10} /> Token: {masked}
          </button>
        )}
      </div>

      {showSetup ? (
        <SetupForm
          pat={pat} setPat={setPatLocal}
          repo={repo} setRepo={setRepoLocal}
          showToken={showToken} setShowToken={setShowToken}
          onSave={saveSetup}
          hasExisting={hasPat}
        />
      ) : (
        <div className="space-y-2">
          <button
            onClick={doPublish}
            disabled={publishing || !hasLocalDiff}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-neon-green to-neon-cyan text-ink-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-green hover:opacity-90">
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            {publishing ? 'GitHub-руу commit хийж байна...' : hasLocalDiff ? 'Нийтлэх (Publish to live site)' : 'Шинэ өөрчлөлт алга'}
          </button>

          {result?.ok && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-neon-green/10 border border-neon-green/40 text-neon-green text-xs">
              <CheckCircle size={14} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-bold">✓ Амжилттай commit хийгдсэн!</div>
                <div className="text-ink-300 mt-0.5">Vercel ~30 секундын дараа deploy дуусна.</div>
                <a href={result.commitUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1 text-neon-cyan hover:underline">
                  Commit харах <ExternalLink size={10} />
                </a>
              </div>
            </div>
          )}
          {result !== null && result.ok === false && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-neon-red/10 border border-neon-red/40 text-neon-red text-xs">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-bold">Алдаа гарлаа</div>
                <div className="text-ink-300 break-all mt-0.5">{result.error}</div>
                <button onClick={() => setShowSetup(true)}
                  className="mt-1 text-neon-cyan hover:underline">Token шинэчлэх</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SetupForm({
  pat, setPat, repo, setRepo, showToken, setShowToken, onSave, hasExisting,
}: {
  pat: string; setPat: (v: string) => void;
  repo: string; setRepo: (v: string) => void;
  showToken: boolean; setShowToken: (v: boolean) => void;
  onSave: () => void;
  hasExisting: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-ink-900/60 border border-ink-700 text-xs text-ink-300 space-y-2">
        <div className="font-bold text-white flex items-center gap-1.5">
          <Github size={14} /> Анх удаа: GitHub token үүсгэх
        </div>
        <ol className="list-decimal pl-5 space-y-1 leading-relaxed">
          <li>
            <a href="https://github.com/settings/tokens/new?scopes=repo&description=trader-book-admin"
              target="_blank" rel="noopener noreferrer"
              className="text-neon-cyan hover:underline inline-flex items-center gap-1">
              GitHub Token үүсгэх хуудас нээх <ExternalLink size={10} />
            </a>
          </li>
          <li><strong>Note:</strong> "trader-book admin" гэх мэт; <strong>Expiration:</strong> "No expiration" эсвэл удаан хугацаа</li>
          <li><strong>Scopes:</strong> зөвхөн <code className="bg-ink-800 px-1 rounded">repo</code> чеклүүлнэ (бүх repo-нд write эрх)</li>
          <li>"Generate token" дарна → гарсан <code>ghp_...</code> token-ыг хуулна</li>
          <li>Доорх талбарт paste хийгээд <strong>Хадгалах</strong></li>
        </ol>
        <div className="text-[10px] text-ink-500 italic">
          Token нь ЗӨВХӨН энэ browser-ийн localStorage-д хадгалагдана. Сервер рүү явахгүй.
        </div>
      </div>

      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">GitHub Token (PAT)</span>
        <div className="flex gap-2 mt-1">
          <input
            type={showToken ? 'text' : 'password'}
            value={pat} onChange={e => setPat(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="flex-1 px-3 py-2 bg-ink-900/60 border border-ink-700 rounded-lg text-white outline-none focus:border-neon-cyan font-mono text-xs" />
          <button onClick={() => setShowToken(!showToken)} type="button"
            className="px-3 rounded-lg text-xs font-bold bg-ink-800 border border-ink-700 text-ink-300 hover:text-white">
            {showToken ? 'Нуух' : 'Харах'}
          </button>
        </div>
      </label>

      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">Repo (owner/name)</span>
        <input
          value={repo} onChange={e => setRepo(e.target.value)}
          placeholder="galaa3313/trader-book"
          className="w-full mt-1 px-3 py-2 bg-ink-900/60 border border-ink-700 rounded-lg text-white outline-none focus:border-neon-cyan font-mono text-xs" />
      </label>

      <div className="flex gap-2">
        <button onClick={onSave} disabled={!pat.trim()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-950 disabled:opacity-40">
          <Save size={12} /> Хадгалах
        </button>
        {hasExisting && (
          <>
            <button onClick={() => { setPat(''); }} type="button"
              className="px-3 py-2 rounded-lg text-xs font-bold bg-neon-red/15 border border-neon-red/40 text-neon-red hover:bg-neon-red/25">
              Token арилгах
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// BOOK EDITOR
// =========================================================================

type BookOv = NonNullable<NonNullable<ReturnType<typeof useOverrides>['books']>[string]>;

function BookEditor({ original, ov }: { original: BookMeta; ov: BookOv }) {
  const merged = { ...original, ...ov };
  const isEdited = Object.keys(ov).length > 0;

  const [draft, setDraft] = useState({
    titleMn: merged.titleMn,
    titleEn: merged.titleEn,
    descMn: merged.descMn,
    descEn: merged.descEn,
    authorMn: merged.authorMn || '',
    authorEn: merged.authorEn || '',
  });
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify({
    titleMn: merged.titleMn, titleEn: merged.titleEn,
    descMn: merged.descMn, descEn: merged.descEn,
    authorMn: merged.authorMn || '', authorEn: merged.authorEn || '',
  });

  const apply = () => {
    const patch: BookOv = {};
    (['titleMn', 'titleEn', 'descMn', 'descEn', 'authorMn', 'authorEn'] as const).forEach(k => {
      const orig = (original as any)[k] || '';
      if (draft[k] !== orig) patch[k] = draft[k];
    });
    setBookOverride(original.id, patch);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const reset = () => {
    if (!isEdited) return;
    if (!confirm('Эх хувилбар руу буцаах уу?')) return;
    resetBookOverride(original.id);
    setDraft({
      titleMn: original.titleMn, titleEn: original.titleEn,
      descMn: original.descMn, descEn: original.descEn,
      authorMn: original.authorMn || '', authorEn: original.authorEn || '',
    });
  };

  return (
    <div className={`glass rounded-xl p-4 border ${isEdited ? 'border-neon-amber/40' : 'border-ink-700'}`}>
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="text-[10px] font-mono text-ink-400 truncate">{original.id}</div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isEdited && <span className="text-[10px] px-1.5 py-0.5 bg-neon-amber/15 text-neon-amber rounded font-bold">EDITED</span>}
          {saved && <span className="text-[10px] px-1.5 py-0.5 bg-neon-green/15 text-neon-green rounded font-bold">✓ Хадгалагдсан</span>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Гарчиг (MN)" value={draft.titleMn} onChange={v => setDraft({ ...draft, titleMn: v })} />
        <Input label="Title (EN)" value={draft.titleEn} onChange={v => setDraft({ ...draft, titleEn: v })} />
        <Input label="Зохиогч (MN)" value={draft.authorMn} onChange={v => setDraft({ ...draft, authorMn: v })} />
        <Input label="Author (EN)" value={draft.authorEn} onChange={v => setDraft({ ...draft, authorEn: v })} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <Area label="Тайлбар (MN)" value={draft.descMn} onChange={v => setDraft({ ...draft, descMn: v })} />
        <Area label="Description (EN)" value={draft.descEn} onChange={v => setDraft({ ...draft, descEn: v })} />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button onClick={apply} disabled={!dirty}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neon-cyan/15 border border-neon-cyan/40 text-neon-cyan disabled:opacity-40 hover:bg-neon-cyan/25">
          <Save size={12} /> Хадгалах (локал)
        </button>
        <button onClick={reset} disabled={!isEdited}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-ink-800 border border-ink-700 text-ink-300 hover:border-neon-red/40 hover:text-neon-red disabled:opacity-40">
          <RotateCcw size={12} /> Reset
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 bg-ink-900/60 border border-ink-700 rounded-lg text-white text-sm outline-none focus:border-neon-cyan" />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">{label}</span>
      <textarea value={value} onChange={e => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 bg-ink-900/60 border border-ink-700 rounded-lg text-white text-sm outline-none focus:border-neon-cyan h-20 resize-y" />
    </label>
  );
}
