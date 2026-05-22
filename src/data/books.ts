// PDF book catalog. Files live in /public/books/<file>.
// Add a new entry here when you drop a new PDF in.

export type BookLang = 'en' | 'mn';
export type BookDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type BookMeta = {
  id: string;                  // url-safe slug
  file: string;                // exact filename in /public/books/
  titleEn: string;
  titleMn: string;
  authorEn?: string;
  authorMn?: string;
  language: BookLang;
  descEn: string;
  descMn: string;
  pages?: number;              // optional; PDF.js can read this at runtime
  difficulty: BookDifficulty;
  topics: string[];            // ['candlestick', 'elliott', 'forex', 'psychology']
  estimatedHours?: number;
  fileSizeMB?: number;
  accentColor?: 'cyan' | 'green' | 'violet' | 'amber' | 'red' | 'pink';
};

export const BOOKS: BookMeta[] = [
  {
    id: 'candlestick-bible-en',
    file: 'THE CANDLESTICK TRADING BIBLE.pdf',
    titleEn: 'The Candlestick Trading Bible',
    titleMn: 'Лаан Графикийн Арилжааны Библи',
    authorEn: 'Munehisa Homma tradition',
    authorMn: 'Мунэхиса Хомма уламжлал',
    language: 'en',
    descEn: 'The most powerful trading system in history — candlestick patterns and price action mastery.',
    descMn: 'Лаан график паттерн ба price action арилжааны бүрэн гарын авлага. Японы цагаан будааны арилжаачин Хоммагийн уламжлал.',
    difficulty: 'intermediate',
    topics: ['candlestick', 'price-action', 'patterns'],
    estimatedHours: 8,
    fileSizeMB: 2.8,
    accentColor: 'amber',
  },
  {
    id: 'elliott-wave-mn',
    file: 'Elliott_wave_монгол_хэлээр.pdf',
    titleEn: 'Elliott Wave Theory (Mongolian)',
    titleMn: 'Эллиотын Давалгааны Онол',
    authorEn: 'Translated to Mongolian',
    authorMn: 'Монгол хэлээр',
    language: 'mn',
    descEn: 'Ralph Nelson Elliott\'s wave theory translated to Mongolian. The fractal nature of markets.',
    descMn: 'Ральф Нельсон Элиотын давалгааны онол монгол хэлээр. Зах зээлийн давтамжит давалгаан хэв шинж, фракталь онол, Фибоначчи харьцаа.',
    difficulty: 'advanced',
    topics: ['elliott-wave', 'fibonacci', 'technical-analysis'],
    estimatedHours: 12,
    fileSizeMB: 11.3,
    accentColor: 'violet',
  },
  {
    id: 'forex-ariljaa-mn',
    file: 'Forex-Ariljaa.pdf',
    titleEn: 'Forex Trading (Mongolian)',
    titleMn: 'Форекс Арилжаа',
    authorMn: 'Монгол хэвлэл',
    language: 'mn',
    descEn: 'Foundational guide to forex trading in Mongolian — currency pairs, leverage, risk management.',
    descMn: 'Форекс арилжааны үндсэн ойлголтууд монгол хэлээр. Валютын хосууд, leverage, эрсдэлийн менежмент, орох/гарах стратеги.',
    difficulty: 'beginner',
    topics: ['forex', 'fundamentals', 'risk'],
    estimatedHours: 4,
    fileSizeMB: 4.2,
    accentColor: 'green',
  },
  {
    id: 'ankhan-shat-munkhjin-mn',
    file: 'Ankhan shat Munkhjin.pdf',
    titleEn: 'Beginner Course by Munkhjin',
    titleMn: 'Анхан Шат — Мөнхжин',
    authorEn: 'Munkhjin',
    authorMn: 'Мөнхжин',
    language: 'mn',
    descEn: 'A complete beginner course in Mongolian — covers the basics needed before live trading.',
    descMn: 'Арилжаа эхлэгчдэд зориулсан бүрэн хичээл. Зах зээлийн үндэс, нэр томьёо, чарт уншилт, эрсдэлийн менежмент бүгд хамрагдсан.',
    difficulty: 'beginner',
    topics: ['fundamentals', 'forex', 'psychology'],
    estimatedHours: 10,
    fileSizeMB: 35.3,
    accentColor: 'cyan',
  },
  {
    id: 'forex-millionaire-en',
    file: '123 FOREX MILLIONAIRE BOOK.pdf',
    titleEn: '123 Forex Millionaire',
    titleMn: '123 Форекс Саятан',
    language: 'en',
    descEn: 'A practical guide to building wealth through disciplined forex trading and proven strategies.',
    descMn: 'Сахилгатай форекс арилжаагаар хөрөнгө бүтээх практик гарын авлага. Туршигдсан стратеги, money management, сэтгэл зүйн бэлтгэл.',
    difficulty: 'intermediate',
    topics: ['forex', 'strategy', 'psychology'],
    estimatedHours: 6,
    fileSizeMB: 5.1,
    accentColor: 'green',
  },
  {
    id: 'unknown-doc-1',
    file: 'doc_2026-05-06_10-15-20.pdf.pdf',
    titleEn: 'Untitled Document',
    titleMn: 'Тодорхойгүй ном',
    language: 'mn',
    descEn: 'Scanned document — title to be assigned. Open it to see what\'s inside.',
    descMn: 'Сканнердсан баримт — гарчиг тодорхойгүй. Нээж үзээд гарчгийг засна уу.',
    difficulty: 'beginner',
    topics: ['misc'],
    fileSizeMB: 1.9,
    accentColor: 'pink',
  },
];

export const BOOK_TOPICS: Record<string, { en: string; mn: string }> = {
  'candlestick':         { en: 'Candlestick',          mn: 'Лаан график' },
  'price-action':        { en: 'Price Action',         mn: 'Price action' },
  'patterns':            { en: 'Patterns',             mn: 'Паттернууд' },
  'elliott-wave':        { en: 'Elliott Wave',         mn: 'Эллиотын давалгаа' },
  'fibonacci':           { en: 'Fibonacci',            mn: 'Фибоначчи' },
  'technical-analysis':  { en: 'Technical Analysis',   mn: 'Техник анализ' },
  'forex':               { en: 'Forex',                mn: 'Форекс' },
  'fundamentals':        { en: 'Fundamentals',         mn: 'Үндэс' },
  'risk':                { en: 'Risk Management',      mn: 'Эрсдэлийн менежмент' },
  'psychology':          { en: 'Psychology',           mn: 'Сэтгэл зүй' },
  'strategy':            { en: 'Strategy',             mn: 'Стратеги' },
  'misc':                { en: 'Misc',                 mn: 'Бусад' },
};
