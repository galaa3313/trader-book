import { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, Calculator, FileText, CheckCircle, TrendingUp, AlertTriangle,
  ChevronRight, ChevronLeft, Award, Search, Home, Menu, X, Lock, Library,
  Zap, Activity, Target, Layers, Sparkles, Flame, Bookmark
} from 'lucide-react';
import { lessons, books, svgImages, glossary as baseGlossary, cheatsheet } from './data';

type AnyObj = Record<string, any>;

type TickerItem = { sym: string; price: number; change: number; digits: number };

function useLiveTicker(): { items: TickerItem[]; live: boolean } {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const daysAgo = (n: number) => {
      const d = new Date(); d.setDate(d.getDate() - n);
      return d.toISOString().slice(0, 10);
    };
    const fetchAll = async () => {
      try {
        const [cryptoRes, fxNowRes, fxPrevRes] = await Promise.all([
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'),
          fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,CNY'),
          fetch(`https://api.frankfurter.app/${daysAgo(3)}?from=USD&to=EUR,GBP,JPY,CNY`),
        ]);
        const [crypto, now, prev] = await Promise.all([cryptoRes.json(), fxNowRes.json(), fxPrevRes.json()]);

        const invChange = (curUSDto: number, prevUSDto: number) => {
          const curPair = 1 / curUSDto;
          const prevPair = 1 / prevUSDto;
          return ((curPair - prevPair) / prevPair) * 100;
        };
        const list: TickerItem[] = [
          { sym: 'EUR/USD', price: 1 / now.rates.EUR, change: invChange(now.rates.EUR, prev.rates.EUR), digits: 4 },
          { sym: 'GBP/USD', price: 1 / now.rates.GBP, change: invChange(now.rates.GBP, prev.rates.GBP), digits: 4 },
          { sym: 'USD/JPY', price: now.rates.JPY, change: ((now.rates.JPY - prev.rates.JPY) / prev.rates.JPY) * 100, digits: 2 },
          { sym: 'USD/CNY', price: now.rates.CNY, change: ((now.rates.CNY - prev.rates.CNY) / prev.rates.CNY) * 100, digits: 4 },
          { sym: 'BTC/USD', price: crypto.bitcoin.usd, change: crypto.bitcoin.usd_24h_change, digits: 0 },
          { sym: 'ETH/USD', price: crypto.ethereum.usd, change: crypto.ethereum.usd_24h_change, digits: 0 },
          { sym: 'SOL/USD', price: crypto.solana.usd, change: crypto.solana.usd_24h_change, digits: 2 },
        ];
        if (!cancelled) { setItems(list); setLive(true); }
      } catch (e) {
        if (!cancelled && items.length === 0) setItems([
          { sym: 'EUR/USD', price: 1.0842, change: 0.24, digits: 4 },
          { sym: 'BTC/USD', price: 67420, change: 2.13, digits: 0 },
          { sym: 'ETH/USD', price: 3520, change: 1.42, digits: 0 },
        ]);
      }
    };
    fetchAll();
    const id = setInterval(fetchAll, 60000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return { items, live };
}

function formatPrice(n: number, digits: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

// ============ MARKET SESSIONS (Forex Factory style) ============
type Session = { name: string; flag: string; openUTC: number; closeUTC: number };

const SESSIONS: Session[] = [
  { name: 'Sydney',   flag: '🇦🇺', openUTC: 21, closeUTC: 6  },
  { name: 'Tokyo',    flag: '🇯🇵', openUTC: 23, closeUTC: 8  },
  { name: 'London',   flag: '🇬🇧', openUTC: 7,  closeUTC: 16 },
  { name: 'New York', flag: '🇺🇸', openUTC: 12, closeUTC: 21 },
];

function useNowTick(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function isForexWeekendClosed(now: Date) {
  const day = now.getUTCDay(); // 0=Sun, 6=Sat
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (day === 6) return true;
  if (day === 0 && mins < 21 * 60) return true;
  if (day === 5 && mins >= 21 * 60) return true;
  return false;
}

function sessionStatus(s: Session, now: Date) {
  if (isForexWeekendClosed(now)) return { open: false, weekend: true, minsUntil: 0 };
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  const openMins = s.openUTC * 60;
  const closeMins = s.closeUTC * 60;
  const wraps = openMins >= closeMins;
  const isOpen = wraps ? (mins >= openMins || mins < closeMins) : (mins >= openMins && mins < closeMins);
  let minsUntil;
  if (isOpen) {
    if (wraps && mins >= openMins) minsUntil = (24 * 60 - mins) + closeMins;
    else minsUntil = closeMins - mins;
  } else {
    if (mins < openMins) minsUntil = openMins - mins;
    else minsUntil = (24 * 60 - mins) + openMins;
  }
  return { open: isOpen, weekend: false, minsUntil };
}

function toUlat(utcHour: number) { return (utcHour + 8) % 24; }
function fmtHour(h: number) { return `${String(h).padStart(2, '0')}:00`; }
function fmtDur(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h === 0 ? `${m}м` : m === 0 ? `${h}ц` : `${h}ц ${m}м`;
}

// ============ ALL FX PAIRS ============
type Pair = { sym: string; base: string; quote: string; group: 'major' | 'minor' | 'exotic' };

const FLAGS: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', CHF: '🇨🇭', CAD: '🇨🇦',
  AUD: '🇦🇺', NZD: '🇳🇿', CNY: '🇨🇳', MXN: '🇲🇽', ZAR: '🇿🇦', SEK: '🇸🇪',
  NOK: '🇳🇴', DKK: '🇩🇰', SGD: '🇸🇬', HKD: '🇭🇰', TRY: '🇹🇷', PLN: '🇵🇱',
  KRW: '🇰🇷', INR: '🇮🇳', BRL: '🇧🇷', HUF: '🇭🇺', CZK: '🇨🇿', ILS: '🇮🇱',
};

const PAIRS: Pair[] = [
  // Majors (7)
  { sym: 'EUR/USD', base: 'EUR', quote: 'USD', group: 'major' },
  { sym: 'GBP/USD', base: 'GBP', quote: 'USD', group: 'major' },
  { sym: 'USD/JPY', base: 'USD', quote: 'JPY', group: 'major' },
  { sym: 'USD/CHF', base: 'USD', quote: 'CHF', group: 'major' },
  { sym: 'USD/CAD', base: 'USD', quote: 'CAD', group: 'major' },
  { sym: 'AUD/USD', base: 'AUD', quote: 'USD', group: 'major' },
  { sym: 'NZD/USD', base: 'NZD', quote: 'USD', group: 'major' },
  // Minors / Crosses (16)
  { sym: 'EUR/GBP', base: 'EUR', quote: 'GBP', group: 'minor' },
  { sym: 'EUR/JPY', base: 'EUR', quote: 'JPY', group: 'minor' },
  { sym: 'EUR/CHF', base: 'EUR', quote: 'CHF', group: 'minor' },
  { sym: 'EUR/AUD', base: 'EUR', quote: 'AUD', group: 'minor' },
  { sym: 'EUR/CAD', base: 'EUR', quote: 'CAD', group: 'minor' },
  { sym: 'EUR/NZD', base: 'EUR', quote: 'NZD', group: 'minor' },
  { sym: 'GBP/JPY', base: 'GBP', quote: 'JPY', group: 'minor' },
  { sym: 'GBP/CHF', base: 'GBP', quote: 'CHF', group: 'minor' },
  { sym: 'GBP/AUD', base: 'GBP', quote: 'AUD', group: 'minor' },
  { sym: 'GBP/CAD', base: 'GBP', quote: 'CAD', group: 'minor' },
  { sym: 'AUD/JPY', base: 'AUD', quote: 'JPY', group: 'minor' },
  { sym: 'AUD/CHF', base: 'AUD', quote: 'CHF', group: 'minor' },
  { sym: 'AUD/NZD', base: 'AUD', quote: 'NZD', group: 'minor' },
  { sym: 'NZD/JPY', base: 'NZD', quote: 'JPY', group: 'minor' },
  { sym: 'CAD/JPY', base: 'CAD', quote: 'JPY', group: 'minor' },
  { sym: 'CHF/JPY', base: 'CHF', quote: 'JPY', group: 'minor' },
  // Exotics (9)
  { sym: 'USD/CNY', base: 'USD', quote: 'CNY', group: 'exotic' },
  { sym: 'USD/MXN', base: 'USD', quote: 'MXN', group: 'exotic' },
  { sym: 'USD/ZAR', base: 'USD', quote: 'ZAR', group: 'exotic' },
  { sym: 'USD/SEK', base: 'USD', quote: 'SEK', group: 'exotic' },
  { sym: 'USD/NOK', base: 'USD', quote: 'NOK', group: 'exotic' },
  { sym: 'USD/SGD', base: 'USD', quote: 'SGD', group: 'exotic' },
  { sym: 'USD/HKD', base: 'USD', quote: 'HKD', group: 'exotic' },
  { sym: 'USD/TRY', base: 'USD', quote: 'TRY', group: 'exotic' },
  { sym: 'USD/PLN', base: 'USD', quote: 'PLN', group: 'exotic' },
];

function useAllRates() {
  const [data, setData] = useState<{ now: Record<string, number>; prev: Record<string, number> } | null>(null);
  const [live, setLive] = useState(false);
  const [updated, setUpdated] = useState<Date | null>(null);
  useEffect(() => {
    let cancelled = false;
    const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
    const load = async () => {
      try {
        const [nowR, prevR] = await Promise.all([
          fetch('https://api.frankfurter.app/latest?from=USD'),
          fetch(`https://api.frankfurter.app/${daysAgo(3)}?from=USD`),
        ]);
        const nowJ = await nowR.json();
        const prevJ = await prevR.json();
        if (cancelled) return;
        setData({
          now: { USD: 1, ...nowJ.rates },
          prev: { USD: 1, ...prevJ.rates },
        });
        setLive(true);
        setUpdated(new Date());
      } catch (e) {}
    };
    load();
    const id = setInterval(load, 120000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  return { data, live, updated };
}

function pipSize(quote: string) { return quote === 'JPY' ? 0.01 : 0.0001; }

function computePair(p: Pair, rates: { now: any; prev: any }, lot: number) {
  const now = rates.now;
  const prev = rates.prev;
  if (!now[p.base] || !now[p.quote] || !prev[p.base] || !prev[p.quote]) return null;
  const price = now[p.quote] / now[p.base];
  const prevPrice = prev[p.quote] / prev[p.base];
  const ps = pipSize(p.quote);
  const pipsDelta = (price - prevPrice) / ps;
  // pip value in USD per lot
  const pipUSD = (lot * 100000 * ps) / (p.quote === 'USD' ? 1 : now[p.quote]);
  const dollarChange = pipsDelta * pipUSD;
  const priceDigits = p.quote === 'JPY' ? 3 : 5;
  return { ...p, price, prevPrice, pipsDelta, pipUSD, dollarChange, priceDigits };
}

function PairsView() {
  const { data, live, updated } = useAllRates();
  const [lot, setLot] = useState(0.1);
  const [filter, setFilter] = useState<'all' | 'major' | 'minor' | 'exotic'>('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    if (!data) return [];
    return PAIRS
      .filter(p => filter === 'all' || p.group === filter)
      .filter(p => p.sym.toLowerCase().includes(search.toLowerCase()))
      .map(p => computePair(p, data, lot))
      .filter(Boolean) as any[];
  }, [data, lot, filter, search]);

  const lotPresets = [0.01, 0.1, 0.5, 1, 5, 10];
  const filters: any[] = [
    { id: 'all', label: 'Бүх хослол', count: PAIRS.length, color: 'cyan' },
    { id: 'major', label: 'Major', count: PAIRS.filter(p => p.group === 'major').length, color: 'green' },
    { id: 'minor', label: 'Minor', count: PAIRS.filter(p => p.group === 'minor').length, color: 'violet' },
    { id: 'exotic', label: 'Exotic', count: PAIRS.filter(p => p.group === 'exotic').length, color: 'amber' },
  ];
  const currentFilter = filters.find(f => f.id === filter)!;

  const [filterOpen, setFilterOpen] = useState(false);
  useEffect(() => {
    if (!filterOpen) return;
    const close = () => setFilterOpen(false);
    setTimeout(() => document.addEventListener('click', close, { once: true }), 0);
    return () => document.removeEventListener('click', close);
  }, [filterOpen]);

  const step = lot < 0.1 ? 0.01 : lot < 1 ? 0.1 : 1;
  const decLot = () => setLot(Math.max(0.01, +(lot - step).toFixed(2)));
  const incLot = () => setLot(+(lot + step).toFixed(2));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-neon-green/15 text-neon-green flex items-center justify-center">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Live хослолууд</h1>
            <p className="text-xs text-ink-400">{PAIRS.length} pair · ECB бодит ханш · pip-ийн live үнэ</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${live ? 'bg-neon-green/15 text-neon-green' : 'bg-ink-700 text-ink-300'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-neon-green animate-glow' : 'bg-ink-400'}`} />
            {live ? 'LIVE' : 'Татаж...'}
          </span>
          {updated && <span className="text-[10px] text-ink-400 font-mono">{updated.toLocaleTimeString('en-GB', { timeZone: 'Asia/Ulaanbaatar', hour: '2-digit', minute: '2-digit' })}</span>}
        </div>
      </div>

      {/* Lot size control */}
      <div className="glass rounded-2xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">Lot хэмжээ</div>
            <div className="text-[10px] text-ink-400 mt-0.5">= {(lot * 100000).toLocaleString()} нэгж · алхам {step}</div>
          </div>
          {/* +/- with manual input */}
          <div className="flex items-center gap-2">
            <button onClick={decLot}
              className="w-11 h-11 rounded-lg bg-ink-800 border border-ink-700 hover:border-neon-cyan/50 hover:bg-ink-700 text-2xl font-bold text-neon-cyan flex items-center justify-center transition-all">
              −
            </button>
            <input
              type="number" inputMode="decimal" step="0.01" min="0.01"
              value={lot}
              onChange={e => {
                const v = +e.target.value;
                if (!isNaN(v) && v > 0) setLot(v);
                else if (e.target.value === '') setLot(0.01);
              }}
              onBlur={e => { if (!+e.target.value || +e.target.value < 0.01) setLot(0.01); }}
              className="w-28 h-11 px-3 bg-ink-900/60 border border-ink-700 rounded-lg text-white font-mono text-2xl font-bold text-center focus:border-neon-cyan outline-none"
            />
            <button onClick={incLot}
              className="w-11 h-11 rounded-lg bg-ink-800 border border-ink-700 hover:border-neon-cyan/50 hover:bg-ink-700 text-2xl font-bold text-neon-cyan flex items-center justify-center transition-all">
              +
            </button>
          </div>
        </div>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-ink-400 self-center mr-1">Хурдан:</span>
          {lotPresets.map(p => (
            <button key={p} onClick={() => setLot(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${lot === p ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' : 'bg-ink-800 text-ink-300 border border-ink-700 hover:border-ink-500'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Filter dropdown + search */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative" onClick={e => e.stopPropagation()}>
          {(() => {
            const TONE: Record<string, { btn: string; opt: string; bar: string }> = {
              cyan:   { btn: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40',     opt: 'bg-neon-cyan/15 text-neon-cyan',     bar: 'border-l-neon-cyan' },
              green:  { btn: 'bg-neon-green/15 text-neon-green border-neon-green/40',  opt: 'bg-neon-green/15 text-neon-green',  bar: 'border-l-neon-green' },
              violet: { btn: 'bg-neon-violet/15 text-neon-violet border-neon-violet/40', opt: 'bg-neon-violet/15 text-neon-violet', bar: 'border-l-neon-violet' },
              amber:  { btn: 'bg-neon-amber/15 text-neon-amber border-neon-amber/40',  opt: 'bg-neon-amber/15 text-neon-amber',  bar: 'border-l-neon-amber' },
            };
            const t = TONE[currentFilter.color];
            return (
              <>
                <button onClick={() => setFilterOpen(!filterOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all min-w-[200px] ${t.btn}`}>
                  <span>📂</span>
                  <span className="flex-1 text-left">{currentFilter.label}</span>
                  <span className="text-xs opacity-70 font-mono">{currentFilter.count}</span>
                  <ChevronRight size={16} className={`transition-transform ${filterOpen ? 'rotate-90' : ''}`} />
                </button>
                {filterOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-full min-w-[220px] glass-strong rounded-xl overflow-hidden z-20 shadow-card animate-fade-in">
                    {filters.map(f => {
                      const isActive = filter === f.id;
                      const ft = TONE[f.color];
                      return (
                        <button key={f.id}
                          onClick={() => { setFilter(f.id); setFilterOpen(false); }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all text-left border-l-2 ${
                            isActive ? `${ft.opt} ${ft.bar}` : 'text-ink-200 hover:bg-white/5 border-l-transparent'
                          }`}>
                          {isActive ? '●' : '○'}
                          <span className="flex-1">{f.label}</span>
                          <span className="text-xs opacity-60 font-mono">{f.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="EUR, JPY..."
            className="w-full pl-9 pr-3 py-2 glass rounded-lg text-white text-sm outline-none focus:border-neon-cyan" />
        </div>
      </div>

      {/* Table header (desktop) */}
      <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 text-[10px] uppercase tracking-wider text-ink-400 font-bold">
        <div className="col-span-3">Хослол</div>
        <div className="col-span-2 text-right">Ханш</div>
        <div className="col-span-2 text-right">Pip / lot</div>
        <div className="col-span-2 text-right">Pips (24ц)</div>
        <div className="col-span-3 text-right">USD өөрчлөлт</div>
      </div>

      {/* Rows */}
      {!data ? (
        <div className="text-center py-12 text-ink-400">⏳ Зах зээлийн ханш татаж байна...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-ink-400">Олдсонгүй</div>
      ) : (
        <div className="space-y-1.5">
          {rows.map((r: any) => {
            const up = r.dollarChange >= 0;
            return (
              <div key={r.sym} className={`glass rounded-xl px-3 py-3 md:py-2.5 grid grid-cols-12 gap-2 items-center transition-all hover:border-neon-cyan/30`}>
                <div className="col-span-12 md:col-span-3 flex items-center gap-2">
                  <span className="text-lg leading-none">{FLAGS[r.base]}{FLAGS[r.quote]}</span>
                  <div>
                    <div className="font-mono font-bold text-white text-sm">{r.sym}</div>
                    <div className="text-[9px] uppercase tracking-wider text-ink-400">{r.group}</div>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 md:text-right">
                  <div className="md:hidden text-[9px] uppercase text-ink-400">Ханш</div>
                  <div className="font-mono text-sm text-ink-100">{r.price.toFixed(r.priceDigits)}</div>
                </div>
                <div className="col-span-4 md:col-span-2 md:text-right">
                  <div className="md:hidden text-[9px] uppercase text-ink-400">$/pip</div>
                  <div className="font-mono text-sm text-neon-cyan">${r.pipUSD.toFixed(2)}</div>
                </div>
                <div className="col-span-4 md:col-span-2 md:text-right">
                  <div className="md:hidden text-[9px] uppercase text-ink-400">Pips</div>
                  <div className={`font-mono text-sm font-bold ${up ? 'text-neon-green' : 'text-neon-red'}`}>
                    {up ? '+' : ''}{r.pipsDelta.toFixed(1)}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3 md:text-right">
                  <div className="md:hidden text-[9px] uppercase text-ink-400">USD ({lot} lot)</div>
                  <div className={`font-mono text-base font-bold ${up ? 'text-neon-green' : 'text-neon-red'}`}>
                    {up ? '▲' : '▼'} {up ? '+' : '-'}${Math.abs(r.dollarChange).toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl bg-ink-900/40 border border-ink-700 text-xs text-ink-400">
        <div className="font-bold text-ink-200 mb-1">💡 Тайлбар</div>
        <div>• <span className="text-neon-cyan">$/pip</span> — Сонгосон lot-д таны 1 pip-ийн үнэ</div>
        <div>• <span className="text-neon-green">Pips (24ц)</span> — Сүүлийн business day-аас одоо хүртэлх pip-ийн зөрүү</div>
        <div>• <span className="text-neon-amber">USD өөрчлөлт</span> — Хэрэв та 24 цагийн өмнө нээсэн бол одоо хэдэн доллар үлдэх вэ</div>
        <div className="mt-1">• Ханшийн эх сурвалж: Frankfurter / ECB (албан ёсны). 2 минут тутамд шинэчилнэ.</div>
      </div>
    </div>
  );
}

function MarketSessions() {
  const now = useNowTick(30000);
  const ulatTime = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Ulaanbaatar', hour: '2-digit', minute: '2-digit' });
  const ulatDate = now.toLocaleDateString('en-GB', { timeZone: 'Asia/Ulaanbaatar', weekday: 'short', day: '2-digit', month: 'short' });
  const weekend = isForexWeekendClosed(now);
  return (
    <div className="relative z-10 bg-ink-900/50 backdrop-blur border-b border-ink-700">
      <div className="flex items-center gap-2.5 px-3 py-2 overflow-x-auto scrollbar-hide">
        <div className="shrink-0 flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-ink-400 font-bold leading-none">УБ цаг</span>
          <span className="text-sm font-mono font-bold text-neon-cyan leading-tight">{ulatTime}</span>
        </div>
        <div className="h-7 w-px bg-ink-700 shrink-0" />
        {weekend && (
          <div className="shrink-0 px-2.5 py-1 rounded-md bg-neon-red/10 border border-neon-red/30 text-[10px] font-bold text-neon-red">
            🚫 Forex амралттай ({ulatDate})
          </div>
        )}
        {SESSIONS.map(s => {
          const st = sessionStatus(s, now);
          const openU = toUlat(s.openUTC);
          const closeU = toUlat(s.closeUTC);
          return (
            <div key={s.name}
              className={`shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all ${
                st.open
                  ? 'bg-neon-green/10 border-neon-green/40 shadow-glow-green'
                  : 'bg-ink-800/40 border-ink-700'
              }`}>
              <span className="text-base leading-none">{s.flag}</span>
              <div className="flex flex-col leading-none">
                <span className={`text-[11px] font-bold ${st.open ? 'text-white' : 'text-ink-200'}`}>{s.name}</span>
                <span className="text-[9px] font-mono text-ink-400 mt-0.5">{fmtHour(openU)}–{fmtHour(closeU)}</span>
              </div>
              {st.weekend ? (
                <span className="text-[10px] text-ink-400">—</span>
              ) : st.open ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neon-green/20 text-[9px] font-bold text-neon-green">
                  <span className="w-1 h-1 rounded-full bg-neon-green animate-glow" />
                  LIVE · {fmtDur(st.minsUntil)}
                </span>
              ) : (
                <span className="text-[9px] text-ink-400 font-mono">in {fmtDur(st.minsUntil)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TradingApp() {
  const [view, setView] = useState('home');
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<AnyObj>({});
  const [quizAnswers, setQuizAnswers] = useState<AnyObj>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<any>(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('trading101_progress');
      if (saved) setProgress(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const saveProgress = (newProgress: AnyObj) => {
    setProgress(newProgress);
    try { localStorage.setItem('trading101_progress', JSON.stringify(newProgress)); } catch (e) {}
  };

  const glossary = useMemo(
    () => [...baseGlossary].sort((a, b) => a.term.localeCompare(b.term)),
    []
  );
  const filteredGlossary = glossary.filter(g =>
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const isLessonCompleted = (id: string) => progress[id]?.completed;
  const isLessonUnlocked = (idx: number) => idx === 0 || isLessonCompleted(lessons[idx - 1].id);
  const completedCount = lessons.filter(l => isLessonCompleted(l.id)).length;
  const overallProgress = (completedCount / lessons.length) * 100;

  const startLesson = (lesson: any) => {
    setCurrentLesson(lesson);
    setCurrentStep(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setView('lesson');
  };

  const openBook = (book: any) => {
    setCurrentBook(book);
    setCurrentChapter(0);
    setView('reader');
  };

  const nextStep = () => {
    if (currentStep < currentLesson.steps.length - 1) setCurrentStep(currentStep + 1);
    else setView('quiz');
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    const correct = currentLesson.quiz.filter((q: any, i: number) => quizAnswers[i] === q.correct).length;
    const passed = correct / currentLesson.quiz.length >= 0.7;
    if (passed) {
      saveProgress({
        ...progress,
        [currentLesson.id]: { completed: true, score: correct, total: currentLesson.quiz.length }
      });
    }
  };

  const { items: tickerItems, live: tickerLive } = useLiveTicker();

  const lessonsByLevel = lessons.reduce<AnyObj>((acc, l) => {
    if (!acc[l.level]) acc[l.level] = [];
    acc[l.level].push(l);
    return acc;
  }, {});

  // ============ NAV ============
  const navItems = [
    { icon: Home, label: 'Нүүр', target: 'home' },
    { icon: Activity, label: 'Live хослол', target: 'pairs' },
    { icon: BookOpen, label: 'Хичээл', target: 'lessons' },
    { icon: Library, label: 'Ном', target: 'library' },
    { icon: Zap, label: 'Cheat', target: 'cheat' },
    { icon: Calculator, label: 'Тооцоо', target: 'calc' },
    { icon: FileText, label: 'Толь', target: 'glossary' },
    { icon: Award, label: 'Явц', target: 'progress' },
  ];

  const NavItem = ({ icon: Icon, label, target, compact = false }: any) => (
    <button
      onClick={() => { setView(target); setMenuOpen(false); }}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left ${
        view === target
          ? 'bg-gradient-to-r from-neon-cyan/15 to-neon-violet/10 text-white shadow-glow-cyan border border-neon-cyan/30'
          : 'text-ink-300 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <Icon size={18} className={view === target ? 'text-neon-cyan' : 'text-ink-400 group-hover:text-neon-cyan transition-colors'} />
      {!compact && <span className="font-medium text-sm">{label}</span>}
    </button>
  );

  // ============ CALCULATORS ============
  const Card = ({ children, accent = 'cyan', className = '' }: any) => {
    const accents: AnyObj = {
      cyan: 'from-neon-cyan/10', green: 'from-neon-green/10', violet: 'from-neon-violet/10',
      amber: 'from-neon-amber/10', red: 'from-neon-red/10', blue: 'from-neon-blue/10'
    };
    return (
      <div className={`relative overflow-hidden glass rounded-2xl p-5 sm:p-6 ${className}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${accents[accent]} via-transparent to-transparent pointer-events-none`} />
        <div className="relative">{children}</div>
      </div>
    );
  };

  const Field = ({ label, value, onChange, step }: any) => (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-ink-400 font-medium">{label}</span>
      <input
        type="number" step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full mt-1.5 px-3.5 py-2.5 bg-ink-900/60 border border-ink-700 rounded-lg text-white font-mono focus:border-neon-cyan outline-none transition-all"
      />
    </label>
  );

  const PositionCalc = () => {
    const [account, setAccount] = useState(1000);
    const [riskPct, setRiskPct] = useState(1);
    const [entry, setEntry] = useState(100);
    const [stopLoss, setStopLoss] = useState(95);
    const riskAmount = account * (riskPct / 100);
    const priceDiff = Math.abs(entry - stopLoss);
    const positionSize = priceDiff > 0 ? riskAmount / priceDiff : 0;
    const positionValue = positionSize * entry;
    return (
      <Card accent="cyan">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/15 flex items-center justify-center">
            <Target className="text-neon-cyan" size={18} />
          </div>
          <h3 className="text-lg font-bold text-white">Position Size</h3>
        </div>
        <div className="space-y-3">
          <Field label="Данс ($)" value={account} onChange={setAccount} />
          <Field label="Эрсдэл (%)" value={riskPct} onChange={setRiskPct} step="0.1" />
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Entry" value={entry} onChange={setEntry} />
            <Field label="Stop" value={stopLoss} onChange={setStopLoss} />
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-ink-900/60 border border-neon-cyan/20 grid grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] uppercase text-ink-400">Эрсдэл</div>
            <div className="text-lg font-bold text-neon-red font-mono">${riskAmount.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-ink-400">Size</div>
            <div className="text-lg font-bold text-neon-cyan font-mono">{positionSize.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-ink-400">Үнэ</div>
            <div className="text-lg font-bold text-white font-mono">${positionValue.toFixed(0)}</div>
          </div>
        </div>
      </Card>
    );
  };

  const RiskRewardCalc = () => {
    const [entry, setEntry] = useState(100);
    const [sl, setSl] = useState(95);
    const [tp, setTp] = useState(110);
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const ratio = risk > 0 ? reward / risk : 0;
    const isGood = ratio >= 2;
    return (
      <Card accent="violet">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-neon-violet/15 flex items-center justify-center">
            <Activity className="text-neon-violet" size={18} />
          </div>
          <h3 className="text-lg font-bold text-white">Risk / Reward</h3>
        </div>
        <div className="space-y-3">
          <Field label="Entry" value={entry} onChange={setEntry} />
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Stop Loss" value={sl} onChange={setSl} />
            <Field label="Take Profit" value={tp} onChange={setTp} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-lg bg-neon-red/10 border border-neon-red/30">
            <div className="text-[10px] uppercase text-ink-400">Risk</div>
            <div className="text-base font-bold text-neon-red font-mono">${risk.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/30">
            <div className="text-[10px] uppercase text-ink-400">Reward</div>
            <div className="text-base font-bold text-neon-green font-mono">${reward.toFixed(2)}</div>
          </div>
        </div>
        <div className={`mt-2.5 p-4 rounded-xl border ${isGood ? 'bg-neon-green/10 border-neon-green/40' : 'bg-neon-amber/10 border-neon-amber/40'}`}>
          <div className="text-[10px] uppercase text-ink-400">R:R харьцаа</div>
          <div className={`text-3xl font-bold font-mono ${isGood ? 'text-neon-green' : 'text-neon-amber'}`}>1 : {ratio.toFixed(2)}</div>
          <div className="text-xs text-ink-300 mt-1">{isGood ? '✓ Маш сайн (≥1:2)' : '⚠ 1:2-аас доош'}</div>
        </div>
      </Card>
    );
  };

  const PnLCalc = () => {
    const [entry, setEntry] = useState(100);
    const [exit, setExit] = useState(105);
    const [size, setSize] = useState(10);
    const [type, setType] = useState('long');
    const pnl = type === 'long' ? (exit - entry) * size : (entry - exit) * size;
    const pnlPct = entry > 0 ? ((pnl / (entry * size)) * 100).toFixed(2) : 0;
    const isProfit = pnl >= 0;
    return (
      <Card accent={isProfit ? 'green' : 'red'}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-neon-green/15 flex items-center justify-center">
            <TrendingUp className="text-neon-green" size={18} />
          </div>
          <h3 className="text-lg font-bold text-white">P&L Calculator</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setType('long')}
              className={`py-2.5 rounded-lg font-bold text-sm transition-all ${type === 'long' ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 shadow-glow-green' : 'bg-ink-800 text-ink-300 border border-ink-700'}`}>
              ↑ LONG
            </button>
            <button onClick={() => setType('short')}
              className={`py-2.5 rounded-lg font-bold text-sm transition-all ${type === 'short' ? 'bg-neon-red/20 text-neon-red border border-neon-red/40 shadow-glow-red' : 'bg-ink-800 text-ink-300 border border-ink-700'}`}>
              ↓ SHORT
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Entry" value={entry} onChange={setEntry} />
            <Field label="Exit" value={exit} onChange={setExit} />
          </div>
          <Field label="Size (нэгж)" value={size} onChange={setSize} />
        </div>
        <div className={`mt-4 p-4 rounded-xl border ${isProfit ? 'bg-neon-green/10 border-neon-green/30' : 'bg-neon-red/10 border-neon-red/30'}`}>
          <div className="text-[10px] uppercase text-ink-400">{isProfit ? 'Ашиг' : 'Алдагдал'}</div>
          <div className={`text-3xl font-bold font-mono ${isProfit ? 'text-neon-green' : 'text-neon-red'}`}>
            {isProfit ? '+' : ''}{pnl.toFixed(2)}$
          </div>
          <div className={`text-sm font-mono ${isProfit ? 'text-neon-green' : 'text-neon-red'}`}>
            {isProfit ? '+' : ''}{pnlPct}%
          </div>
        </div>
      </Card>
    );
  };

  const PipCalc = () => {
    const [pips, setPips] = useState(20);
    const [lot, setLot] = useState(0.1);
    const [pair, setPair] = useState('EURUSD');
    const pipValue = pair === 'EURUSD' ? 10 : pair === 'USDJPY' ? 9.1 : 10;
    const result = pips * lot * pipValue;
    return (
      <Card accent="amber">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-neon-amber/15 flex items-center justify-center">
            <Layers className="text-neon-amber" size={18} />
          </div>
          <h3 className="text-lg font-bold text-white">Pip Value</h3>
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-ink-400 font-medium">Хос</span>
            <select value={pair} onChange={e => setPair(e.target.value)}
              className="w-full mt-1.5 px-3.5 py-2.5 bg-ink-900/60 border border-ink-700 rounded-lg text-white font-mono focus:border-neon-amber outline-none">
              <option>EURUSD</option><option>GBPUSD</option><option>USDJPY</option><option>XAUUSD</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Pip-үүд" value={pips} onChange={setPips} />
            <Field label="Lot" value={lot} onChange={setLot} step="0.01" />
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-ink-900/60 border border-neon-amber/30">
          <div className="text-[10px] uppercase text-ink-400">Нийт үнэ цэн</div>
          <div className="text-3xl font-bold text-neon-amber font-mono">${result.toFixed(2)}</div>
        </div>
      </Card>
    );
  };

  // Sub-components continue below
  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 relative">
      {/* Aurora background */}
      <div className="fixed inset-0 bg-aurora pointer-events-none" />
      <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Top ticker — live data from CoinGecko + Frankfurter ECB */}
      <div className="relative z-10 bg-ink-900/80 backdrop-blur border-b border-ink-700 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold shrink-0 ${tickerLive ? 'bg-neon-green/15 text-neon-green' : 'bg-ink-700 text-ink-300'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tickerLive ? 'bg-neon-green animate-glow' : 'bg-ink-400'}`} />
            {tickerLive ? 'LIVE' : 'Татаж...'}
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-ticker whitespace-nowrap">
              {[...Array(2)].map((_, k) => (
                <div key={k} className="flex gap-6 px-4 shrink-0">
                  {tickerItems.length === 0 ? (
                    <span className="text-ink-400">Зах зээлийн үнэ татаж байна...</span>
                  ) : tickerItems.map(it => {
                    const up = it.change >= 0;
                    return (
                      <span key={it.sym} className="inline-flex items-center gap-1.5">
                        <span className={`w-1 h-1 rounded-full ${up ? 'bg-neon-green' : 'bg-neon-red'}`} />
                        <span className="text-ink-100 font-semibold">{it.sym}</span>
                        <span className="text-ink-200">{formatPrice(it.price, it.digits)}</span>
                        <span className={up ? 'text-neon-green' : 'text-neon-red'}>
                          {up ? '▲' : '▼'} {Math.abs(it.change).toFixed(2)}%
                        </span>
                      </span>
                    );
                  })}
                  <span className="text-ink-500">⚠ Боловсролын зорилготой</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market sessions strip (forex factory style, ULAT time) */}
      <MarketSessions />

      <div className="relative z-10 flex">
        {/* Mobile overlay */}
        {menuOpen && (
          <div onClick={() => setMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/70 z-30 backdrop-blur-sm" />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass-strong p-4 z-40 transition-transform overflow-y-auto flex-shrink-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center shadow-glow-cyan">
                <TrendingUp size={20} className="text-ink-950" />
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-tight text-white">Trading 101</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-400">Academy</div>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} className="lg:hidden text-ink-300">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1 mb-6">
            {navItems.map(n => <NavItem key={n.target} {...n} />)}
          </nav>

          {/* Progress card */}
          <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-neon-green/15 to-neon-cyan/5 border border-neon-green/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={14} className="text-neon-amber" />
              <div className="text-[10px] uppercase tracking-wider text-ink-300 font-bold">Явц</div>
            </div>
            <div className="text-2xl font-display font-bold text-white">{completedCount}<span className="text-ink-400 text-base">/{lessons.length}</span></div>
            <div className="text-xs text-ink-400 mb-2">хичээл</div>
            <div className="h-1.5 bg-ink-900/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>

          <div className="mt-4 text-[10px] text-ink-500 text-center">
            © Trading 101 Academy
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 min-h-screen pb-24 lg:pb-8">
          {/* Mobile header */}
          <div className="lg:hidden p-4 flex items-center justify-between border-b border-ink-700 sticky top-0 bg-ink-950/80 backdrop-blur z-30">
            <button onClick={() => setMenuOpen(true)} className="text-ink-200 p-1.5 hover:bg-white/5 rounded-lg">
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
                <TrendingUp size={14} className="text-ink-950" />
              </div>
              <div className="font-display font-bold text-white">Trading 101</div>
            </div>
            <div className="w-8" />
          </div>

          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto w-full">
            {view === 'home' && <HomeView setView={setView} lessons={lessons} books={books} glossary={glossary}
              completedCount={completedCount} overallProgress={overallProgress} cheatsheet={cheatsheet}
              progress={progress} startLesson={startLesson} isLessonUnlocked={isLessonUnlocked} />}

            {view === 'pairs' && <PairsView />}

            {view === 'lessons' && (
              <div className="animate-fade-in">
                <SectionHeader title="Хичээлүүд" subtitle={`${lessons.length} хичээл · 3 түвшин · дарааллаар суралцана`} icon={BookOpen} accent="cyan" />
                {Object.entries(lessonsByLevel).map(([level, levelLessons]: any, lvlIdx) => {
                  const levelMeta: AnyObj = {
                    'Анхан шат': { icon: '🎓', color: 'green', desc: 'Үндэс — зах зээл, нэр томьёо, эрсдэл' },
                    'Дунд шат': { icon: '🕯️', color: 'amber', desc: 'Лаан график, price action' },
                    'Ахисан шат': { icon: '🌊', color: 'violet', desc: 'Elliott Wave, Fibonacci' }
                  };
                  const meta = levelMeta[level];
                  return (
                    <div key={level} className="mb-8 animate-slide-up" style={{ animationDelay: `${lvlIdx * 80}ms` }}>
                      <div className={`flex items-center gap-3 mb-4 px-1`}>
                        <div className={`text-2xl`}>{meta.icon}</div>
                        <div>
                          <h2 className="text-lg font-display font-bold text-white">{level}</h2>
                          <div className="text-xs text-ink-400">{meta.desc}</div>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {levelLessons.map((lesson: any) => {
                          const idx = lessons.indexOf(lesson);
                          const completed = isLessonCompleted(lesson.id);
                          const unlocked = isLessonUnlocked(idx);
                          return (
                            <button key={lesson.id}
                              onClick={() => unlocked && startLesson(lesson)}
                              disabled={!unlocked}
                              className={`group text-left rounded-2xl p-4 transition-all relative overflow-hidden ${
                                unlocked ? 'glass hover:border-neon-cyan/40 hover:shadow-glow-cyan cursor-pointer' : 'bg-ink-900/40 border border-ink-800 opacity-50 cursor-not-allowed'
                              }`}>
                              {completed && <div className="absolute top-3 right-3"><CheckCircle size={16} className="text-neon-green" /></div>}
                              {!unlocked && <div className="absolute top-3 right-3"><Lock size={14} className="text-ink-500" /></div>}
                              <div className="flex items-start gap-3">
                                <div className="text-3xl">{lesson.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[10px] uppercase tracking-wider text-ink-400 font-mono">#{String(idx + 1).padStart(2, '0')}</div>
                                  <div className="font-display font-bold text-white text-sm leading-tight mb-1.5">{lesson.title}</div>
                                  <div className="flex items-center gap-3 text-[11px] text-ink-400">
                                    <span>📖 {lesson.steps.length}</span>
                                    <span>📝 {lesson.quiz.length}</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {view === 'lesson' && currentLesson && (
              <div className="animate-fade-in max-w-3xl mx-auto">
                <button onClick={() => setView('lessons')} className="flex items-center gap-1 text-ink-400 hover:text-neon-cyan mb-4 text-sm transition-colors">
                  <ChevronLeft size={16} /> Хичээлүүд
                </button>
                <div className="flex items-start gap-4 mb-5">
                  <div className="text-5xl">{currentLesson.icon}</div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-neon-cyan font-mono mb-1">{currentLesson.level}</div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">{currentLesson.title}</h1>
                  </div>
                </div>
                <div className="flex gap-1 mb-6">
                  {currentLesson.steps.map((_: any, i: number) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= currentStep ? 'bg-gradient-to-r from-neon-cyan to-neon-violet' : 'bg-ink-800'}`} />
                  ))}
                </div>
                <Card accent="cyan" className="mb-6">
                  <div className="text-[10px] uppercase tracking-wider text-ink-400 font-mono mb-2">Алхам {currentStep + 1} / {currentLesson.steps.length}</div>
                  <h2 className="text-xl font-display font-bold mb-4 text-white">{currentLesson.steps[currentStep].title}</h2>
                  <div className="text-ink-200 leading-relaxed whitespace-pre-line text-[15px] sm:text-base">{currentLesson.steps[currentStep].content}</div>
                </Card>
                <div className="flex justify-between gap-3">
                  <button onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : setView('lessons')}
                    className="flex-1 sm:flex-none px-5 py-3 glass hover:bg-white/10 rounded-xl font-medium text-sm text-ink-200">
                    ← Өмнөх
                  </button>
                  <button onClick={nextStep}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-950 rounded-xl font-bold text-sm shadow-glow-cyan hover:scale-[1.02] transition-all">
                    {currentStep === currentLesson.steps.length - 1 ? 'Тест өгөх →' : 'Дараах →'}
                  </button>
                </div>
              </div>
            )}

            {view === 'quiz' && currentLesson && (
              <div className="animate-fade-in max-w-3xl mx-auto">
                <button onClick={() => setView('lesson')} className="flex items-center gap-1 text-ink-400 hover:text-neon-cyan mb-4 text-sm">
                  <ChevronLeft size={16} /> Буцах
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-neon-amber" size={28} />
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Тест</h1>
                </div>
                <p className="text-ink-400 mb-6 text-sm">{currentLesson.title}</p>
                <div className="space-y-4">
                  {currentLesson.quiz.map((q: any, qi: number) => (
                    <Card key={qi} accent="violet">
                      <div className="font-display font-bold text-white mb-3">{qi + 1}. {q.q}</div>
                      <div className="space-y-2">
                        {q.options.map((opt: string, oi: number) => {
                          const selected = quizAnswers[qi] === oi;
                          const isCorrect = oi === q.correct;
                          let cls = 'border-ink-700 hover:border-neon-cyan/40 hover:bg-white/5 text-ink-200';
                          if (quizSubmitted) {
                            if (isCorrect) cls = 'border-neon-green/60 bg-neon-green/10 text-white';
                            else if (selected) cls = 'border-neon-red/60 bg-neon-red/10 text-white';
                            else cls = 'border-ink-700 text-ink-400';
                          } else if (selected) cls = 'border-neon-cyan bg-neon-cyan/10 text-white shadow-glow-cyan';
                          return (
                            <button key={oi}
                              onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                              disabled={quizSubmitted}
                              className={`w-full text-left px-4 py-3 border rounded-xl transition-all text-sm ${cls}`}>
                              <span className="font-mono text-xs text-ink-400 mr-2">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                              {quizSubmitted && isCorrect && ' ✓'}
                            </button>
                          );
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
                {!quizSubmitted ? (
                  <button onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < currentLesson.quiz.length}
                    className="mt-6 w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-950 disabled:from-ink-700 disabled:to-ink-700 disabled:text-ink-500 disabled:cursor-not-allowed rounded-xl font-bold shadow-glow-cyan disabled:shadow-none transition-all">
                    Хариу шалгах
                  </button>
                ) : (
                  <div className="mt-6">
                    {(() => {
                      const correct = currentLesson.quiz.filter((q: any, i: number) => quizAnswers[i] === q.correct).length;
                      const passed = correct / currentLesson.quiz.length >= 0.7;
                      return (
                        <Card accent={passed ? 'green' : 'amber'} className="text-center">
                          <div className="text-5xl mb-2">{passed ? '🎉' : '💪'}</div>
                          <div className="text-3xl font-display font-bold mb-1 text-white">{correct}/{currentLesson.quiz.length}</div>
                          <div className={`text-sm mb-4 ${passed ? 'text-neon-green' : 'text-neon-amber'}`}>
                            {passed ? 'Гайхалтай! Дараагийн хичээл нээгдлээ.' : 'Дахин уншаад туршаарай (70%+ хэрэгтэй).'}
                          </div>
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => setView('lessons')} className="px-5 py-2 glass hover:bg-white/10 rounded-xl text-sm">
                              Хичээлүүд
                            </button>
                            {!passed && (
                              <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                                className="px-5 py-2 bg-neon-amber/20 hover:bg-neon-amber/30 text-neon-amber border border-neon-amber/40 rounded-xl font-bold text-sm">
                                Дахин оролдох
                              </button>
                            )}
                          </div>
                        </Card>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {view === 'library' && (
              <div className="animate-fade-in">
                <SectionHeader title="Номын сан" subtitle="Арилжааны сонгодог номнууд монгол хэлээр" icon={Library} accent="violet" />
                <div className="grid md:grid-cols-2 gap-4">
                  {books.map((book, i) => (
                    <button key={book.id} onClick={() => openBook(book)}
                      className="group relative overflow-hidden text-left rounded-2xl p-5 sm:p-6 glass hover:border-neon-violet/40 hover:shadow-glow-violet transition-all animate-slide-up"
                      style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="absolute -right-8 -top-8 text-9xl opacity-10 group-hover:opacity-20 transition-opacity">{book.icon}</div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <Bookmark size={14} className="text-neon-violet" />
                          <div className="text-[10px] uppercase tracking-widest text-ink-400 font-mono">{book.author}</div>
                        </div>
                        <h3 className="text-xl font-display font-bold text-white mb-2">{book.title}</h3>
                        <p className="text-sm text-ink-300 mb-4">{book.description}</p>
                        <div className="flex items-center gap-3 text-xs text-ink-400">
                          <span className="px-2 py-1 rounded-md bg-neon-violet/10 text-neon-violet">📖 {book.chapters.length} бүлэг</span>
                          <span className="text-neon-cyan font-bold">Уншиж эхлэх →</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {view === 'reader' && currentBook && (
              <div className="animate-fade-in max-w-3xl mx-auto">
                <button onClick={() => setView('library')} className="flex items-center gap-1 text-ink-400 hover:text-neon-violet mb-4 text-sm">
                  <ChevronLeft size={16} /> Номын сан
                </button>
                <Card accent="violet" className="mb-5">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{currentBook.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-widest text-ink-400 font-mono">{currentBook.author}</div>
                      <h2 className="text-lg sm:text-xl font-display font-bold text-white">{currentBook.title}</h2>
                    </div>
                  </div>
                </Card>

                <div className="mb-5">
                  <label className="block text-[10px] uppercase tracking-wider text-ink-400 mb-2 font-bold">Бүлэг сонгох</label>
                  <select value={currentChapter} onChange={e => setCurrentChapter(+e.target.value)}
                    className="w-full px-4 py-3 bg-ink-900/60 border border-ink-700 rounded-xl text-white font-medium outline-none focus:border-neon-violet">
                    {currentBook.chapters.map((ch: any, i: number) => (
                      <option key={i} value={i}>{i + 1}. {ch.title.replace(/^\d+-р бүлэг:?\s*/, '')}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-ink-400 mb-1.5">
                    <span>Уншилт</span>
                    <span className="font-mono">{currentChapter + 1} / {currentBook.chapters.length}</span>
                  </div>
                  <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-violet to-neon-cyan transition-all"
                      style={{ width: `${((currentChapter + 1) / currentBook.chapters.length) * 100}%` }} />
                  </div>
                </div>

                <article className="glass rounded-2xl p-5 sm:p-7 lg:p-8 overflow-hidden">
                  <div className="text-[10px] uppercase tracking-widest text-neon-violet font-mono mb-2">Бүлэг {currentChapter + 1}</div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-6 text-white">
                    {currentBook.chapters[currentChapter].title}
                  </h2>
                  {currentBook.chapters[currentChapter].image && svgImages[currentBook.chapters[currentChapter].image] && (
                    <div className="bg-ink-100/95 rounded-xl p-3 sm:p-4 mb-6 max-w-2xl mx-auto"
                      dangerouslySetInnerHTML={{ __html: svgImages[currentBook.chapters[currentChapter].image] }} />
                  )}
                  <div className="text-ink-200 leading-loose whitespace-pre-line text-[15px] sm:text-base lg:text-[17px]">
                    {currentBook.chapters[currentChapter].content}
                  </div>
                </article>

                <div className="flex justify-between gap-3 mt-6">
                  <button onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                    disabled={currentChapter === 0}
                    className="flex-1 sm:flex-none px-5 py-3 glass hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-medium flex items-center justify-center gap-2 text-sm">
                    <ChevronLeft size={18} /> Өмнөх
                  </button>
                  <button onClick={() => setCurrentChapter(Math.min(currentBook.chapters.length - 1, currentChapter + 1))}
                    disabled={currentChapter === currentBook.chapters.length - 1}
                    className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-neon-violet to-neon-cyan text-ink-950 disabled:from-ink-700 disabled:to-ink-700 disabled:text-ink-500 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
                    Дараах <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {view === 'cheat' && (
              <div className="animate-fade-in">
                <SectionHeader title="Cheat Sheet" subtitle="Хурдан ишлэл — арилжааны бэлэн томьёонууд" icon={Zap} accent="amber" />
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cheatsheet.map((c, i) => (
                    <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <Card accent={c.accent}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-2xl">{c.icon}</div>
                          <h3 className="font-display font-bold text-white">{c.title}</h3>
                        </div>
                        <ul className="space-y-1.5 text-sm text-ink-200">
                          {c.items.map((it: string, k: number) => (
                            <li key={k} className="flex gap-2"><span className="text-neon-cyan">▸</span><span>{it}</span></li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'calc' && (
              <div className="animate-fade-in">
                <SectionHeader title="Тооцоологчид" subtitle="Position size, R:R, P&L, Pip value" icon={Calculator} accent="cyan" />
                <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4">
                  <PositionCalc />
                  <RiskRewardCalc />
                  <PnLCalc />
                  <PipCalc />
                </div>
              </div>
            )}

            {view === 'glossary' && (
              <div className="animate-fade-in">
                <SectionHeader title="Нэр томьёоны толь" subtitle={`${glossary.length} нэр томьёо · хайлттай`} icon={FileText} accent="violet" />
                <div className="relative mb-5">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
                  <input value={glossarySearch} onChange={e => setGlossarySearch(e.target.value)}
                    placeholder="Хайх... (жш: pip, hammer, fibonacci)"
                    className="w-full pl-11 pr-4 py-3.5 glass rounded-xl text-white outline-none focus:border-neon-cyan transition-all" />
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredGlossary.length === 0 ? (
                    <div className="col-span-full text-ink-400 text-center py-12">Олдсонгүй</div>
                  ) : filteredGlossary.map((g, i) => (
                    <div key={i} className="glass rounded-xl p-4 hover:border-neon-violet/40 transition-all">
                      <div className="font-display font-bold text-neon-cyan mb-1.5 text-sm">{g.term}</div>
                      <div className="text-ink-300 text-xs leading-relaxed">{g.def}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'progress' && (
              <div className="animate-fade-in">
                <SectionHeader title="Миний явц" subtitle="Сурах аяллын явц ба шагнал" icon={Award} accent="green" />
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card accent="green">
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Нийт явц</div>
                    <div className="text-4xl font-display font-bold text-white my-1">{Math.round(overallProgress)}<span className="text-xl text-ink-400">%</span></div>
                    <div className="h-2 bg-ink-800 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-neon-green to-neon-cyan" style={{ width: `${overallProgress}%` }} />
                    </div>
                  </Card>
                  <Card accent="cyan">
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Хичээл</div>
                    <div className="text-4xl font-display font-bold text-white my-1">{completedCount}<span className="text-xl text-ink-400">/{lessons.length}</span></div>
                    <div className="text-xs text-ink-400">Дууссан</div>
                  </Card>
                  <Card accent="amber">
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Дундаж оноо</div>
                    <div className="text-4xl font-display font-bold text-white my-1">
                      {(() => {
                        const done = lessons.filter(l => progress[l.id]?.completed);
                        if (!done.length) return '—';
                        const avg = done.reduce((s, l) => s + (progress[l.id].score / progress[l.id].total), 0) / done.length;
                        return Math.round(avg * 100) + '%';
                      })()}
                    </div>
                    <div className="text-xs text-ink-400">Quiz-н дундаж</div>
                  </Card>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {lessons.map((l, i) => {
                    const p = progress[l.id];
                    return (
                      <div key={l.id} className="glass rounded-xl p-4 flex items-center gap-3">
                        <div className="text-2xl">{l.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase tracking-wider text-ink-400">{l.level}</div>
                          <div className="font-medium text-white text-sm truncate">{l.title}</div>
                          {p?.completed ? (
                            <div className="text-xs text-neon-green">✓ {p.score}/{p.total}</div>
                          ) : (
                            <div className="text-xs text-ink-400">{isLessonUnlocked(i) ? 'Эхлээгүй' : '🔒 Хаалттай'}</div>
                          )}
                        </div>
                        {p?.completed && <Award className="text-neon-amber" size={18} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-strong border-t border-ink-700 pb-safe">
        <div className="grid grid-cols-5 px-1 pt-1.5">
          {[
            { icon: Home, label: 'Нүүр', target: 'home' },
            { icon: Activity, label: 'Live', target: 'pairs' },
            { icon: BookOpen, label: 'Хичээл', target: 'lessons' },
            { icon: Calculator, label: 'Тоо', target: 'calc' },
            { icon: Award, label: 'Явц', target: 'progress' },
          ].map(n => (
            <button key={n.target} onClick={() => setView(n.target)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-lg transition-all ${
                view === n.target ? 'text-neon-cyan' : 'text-ink-400'
              }`}>
              <n.icon size={20} />
              <span className="text-[10px] font-medium">{n.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ============ Sub-components ============
function SectionHeader({ title, subtitle, icon: Icon, accent }: any) {
  const colors: AnyObj = {
    cyan: 'text-neon-cyan bg-neon-cyan/15',
    green: 'text-neon-green bg-neon-green/15',
    violet: 'text-neon-violet bg-neon-violet/15',
    amber: 'text-neon-amber bg-neon-amber/15',
    red: 'text-neon-red bg-neon-red/15',
  };
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-ink-400">{subtitle}</p>
      </div>
    </div>
  );
}

function HomeView({ setView, lessons, books, glossary, completedCount, overallProgress, cheatsheet, progress, startLesson, isLessonUnlocked }: any) {
  const nextLesson = lessons.find((l: any, i: number) => !progress[l.id]?.completed && isLessonUnlocked(i));
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-strong p-6 sm:p-8 lg:p-10">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-neon-violet/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-glow" />
            <span className="text-[10px] uppercase tracking-widest text-neon-green font-bold">Шинэчлэгдсэн UI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold mb-3 leading-[1.05]">
            <span className="text-white">Арилжааг </span>
            <span className="shimmer-text">эзэмш</span>
            <span className="text-white">.</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-300 mb-6 max-w-2xl">
            Анхан шатнаас Elliott Wave хүртэл — {lessons.length} хичээл, {books.length} ном, {glossary.length}+ нэр томьёо, 4 тооцоологч. Бүгд монголоор.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {nextLesson ? (
              <button onClick={() => startLesson(nextLesson)}
                className="px-5 py-3 bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-950 rounded-xl font-bold text-sm shadow-glow-cyan hover:scale-[1.02] transition-all flex items-center gap-2">
                ▶ Үргэлжлүүл: {nextLesson.title.slice(0, 24)}...
              </button>
            ) : (
              <button onClick={() => setView('lessons')}
                className="px-5 py-3 bg-gradient-to-r from-neon-cyan to-neon-violet text-ink-950 rounded-xl font-bold text-sm shadow-glow-cyan">
                Сурч эхлэх →
              </button>
            )}
            <button onClick={() => setView('pairs')}
              className="px-5 py-3 bg-neon-green/15 border border-neon-green/40 text-neon-green hover:bg-neon-green/25 rounded-xl font-bold text-sm flex items-center gap-2">
              📊 Live хослол
            </button>
            <button onClick={() => setView('library')}
              className="px-5 py-3 glass hover:bg-white/10 rounded-xl font-bold text-sm flex items-center gap-2">
              📚 Номын сан
            </button>
            <button onClick={() => setView('cheat')}
              className="px-5 py-3 glass hover:bg-white/10 rounded-xl font-bold text-sm flex items-center gap-2">
              ⚡ Cheat Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Хичээл', value: lessons.length, icon: BookOpen, color: 'cyan' },
          { label: 'Ном', value: books.length, icon: Library, color: 'violet' },
          { label: 'Нэр томьёо', value: glossary.length + '+', icon: FileText, color: 'amber' },
          { label: 'Дууссан', value: completedCount, icon: CheckCircle, color: 'green' },
        ].map((s, i) => {
          const C: AnyObj = { cyan: 'text-neon-cyan', violet: 'text-neon-violet', amber: 'text-neon-amber', green: 'text-neon-green' };
          const B: AnyObj = { cyan: 'bg-neon-cyan/10', violet: 'bg-neon-violet/10', amber: 'bg-neon-amber/10', green: 'bg-neon-green/10' };
          return (
            <div key={i} className="glass rounded-2xl p-4 relative overflow-hidden">
              <div className={`absolute -top-4 -right-4 w-16 h-16 ${B[s.color]} rounded-full blur-xl`} />
              <s.icon className={`${C[s.color]} mb-2`} size={18} />
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">{s.value}</div>
              <div className="text-xs text-ink-400">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Three levels */}
      <div>
        <h2 className="text-lg font-display font-bold mb-3 text-white px-1">Сурах түвшин</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { level: 'Анхан шат', emoji: '🎓', desc: 'Зах зээл, нэр томьёо, эрсдэлийн менежмент', color: 'from-neon-green/15 to-neon-cyan/5', border: 'border-neon-green/30' },
            { level: 'Дунд шат', emoji: '🕯️', desc: 'Лаан график паттернууд, price action', color: 'from-neon-amber/15 to-neon-red/5', border: 'border-neon-amber/30' },
            { level: 'Ахисан шат', emoji: '🌊', desc: 'Элиотын давалгаа, Фибоначчи', color: 'from-neon-violet/15 to-neon-pink/5', border: 'border-neon-violet/30' },
          ].map((lv, i) => {
            const count = lessons.filter((l: any) => l.level === lv.level).length;
            return (
              <button key={lv.level} onClick={() => setView('lessons')}
                className={`text-left rounded-2xl p-5 bg-gradient-to-br ${lv.color} border ${lv.border} hover:scale-[1.01] transition-all`}>
                <div className="text-3xl mb-2">{lv.emoji}</div>
                <h3 className="font-display font-bold text-white text-base mb-1">{lv.level}</h3>
                <p className="text-xs text-ink-300 mb-2">{lv.desc}</p>
                <div className="text-[10px] uppercase tracking-wider text-ink-400 font-mono">{count} хичээл</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick cheatsheet preview */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2"><Zap size={18} className="text-neon-amber" /> Хурдан зөвлөмж</h2>
          <button onClick={() => setView('cheat')} className="text-xs text-neon-cyan font-bold">Бүгд →</button>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {cheatsheet.slice(0, 3).map((c: any, i: number) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">{c.icon}</div>
                <h3 className="font-display font-bold text-white text-sm">{c.title}</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-ink-200">
                {c.items.slice(0, 4).map((it: string, k: number) => (
                  <li key={k} className="flex gap-2"><span className="text-neon-cyan">▸</span><span>{it}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="rounded-2xl p-5 bg-neon-amber/5 border border-neon-amber/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-neon-amber flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-display font-bold text-neon-amber mb-1.5 text-sm">Чухал анхааруулга</h3>
            <p className="text-xs text-ink-300 leading-relaxed">
              Арилжаа нь өндөр эрсдэлтэй. Бодит мөнгөөр арилжаа хийхээсээ өмнө demo дансаар сайн дадлага хийж, зөвхөн алдаж болох мөнгөөрөө л арилжаалаарай.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
