// Vercel serverless function: translates forex/trading text.
//
// Two providers (Hybrid):
//   - "google" (default, FREE)   — unofficial translate.googleapis.com endpoint
//   - "claude" (premium, paid)   — Anthropic Claude Sonnet 4.6 with forex prompt
//
// POST /api/translate
// body: { text, fromLang, toLang, bookTitle?, provider? }
// returns: { translation, provider, model?, usage?, cached? }

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `Та форекс/арилжааны мэргэжилтэн орчуулагч юм.
Англи ⇄ Монгол хооронд форексийн ном, нийтлэлийг орчуулна.

ЧАНАРЫН ШААРДЛАГА:

1. ҮГЧЛЭН БИШ — УТГА ЗҮЙН ОРЧУУЛГА.
   Үг бүрийг шууд орчуулахгүй, текстийг бүхэлд нь уншиж, ойлгоод дараа нь
   байгалийн монгол/англи хэлээр илэрхийлнэ.

2. КОНТЕКСТ ХАРГАЛЗАХ. Форекс арилжааны нэр томьёог зөв ашигла:
   - "pip" → "пип" (хадгалах)
   - "leverage" → "хөшүүрэг"
   - "spread" → "спрэд" (хадгалах)
   - "stop loss" → "алдагдлын зогсоол" / "stop loss"
   - "take profit" → "ашгийн зогсоол" / "take profit"
   - "candlestick" → "лаан график"
   - "trend" → "чиг хандлага" / "тренд"
   - "support / resistance" → "тулгуур / эсэргүүцэл"
   - "bullish" → "өсөх хандлагатай"
   - "bearish" → "буурах хандлагатай"
   - "Elliott Wave" → "Эллиотын давалгаа"
   - "Fibonacci" → "Фибоначчи"

3. ЁГТЛОЛ, ҮГИЙН ТОГЛООМ.
   Англи idiom-ыг шууд биш, монгол хэлэнд тохирох утгаар нь буулгана.
   Жишээ: "bull market" → "өсөлтийн зах зээл" (биш "үхрийн зах зээл").

4. ӨГҮҮЛБЭРИЙН БҮТЦИЙГ ЗАСАХ.
   Орчуулсан текст монгол / англи хэлний жам ёсны бүтэцтэй байх ёстой.

5. ТООН УТГА, ФОРМУЛЫГ ХАДГАЛАХ.
   Тоо, хувь, формул, томьёог ОГТ өөрчилөхгүй яг хэвээр нь үлдээх.

6. ГАРЧИГ, ТОВЧЛОЛ.
   H1, H2, H3 гарчиг, list, table бүтцийг хадгалж орчуулах.

7. ЭХ СУРВАЛЖИЙН ӨНГӨ АЯСЫГ ХАДГАЛАХ.
   Албан / ярианы өнгө аясыг алдагдуулахгүй буулгана.

8. ДУТУУ ОЙЛГОЛТТОЙ ҮГИЙГ ТАЙЛБАРЛАХ.
   Англи нэр томьёог монголоор төгс илэрхийлэх боломжгүй бол хаалтанд эх үгийг бичих:
   жш. "хөшүүрэг (leverage)".

9. ШАЛГАЛТ. Орчуулсны дараа:
   - Энэ монгол / англи текст байгалийн уу?
   - Эх утгыг бүрэн илэрхийлж байна уу?
   - Форекс мэддэг хүн уншихад тодорхой уу?

ХАРИУЛТЫН ФОРМАТ:
- Зөвхөн орчуулсан текстийг буцаа. Тайлбар, кодын тагнуул, "Here is the translation" гэх мэт нэмэлт үг ХЭРЭГГҮЙ.
- Хэрэв эх текст хоосон эсвэл утгагүй бол яг тэр хэвээр нь буцаа.`;

const LANG_NAME = { en: 'англи', mn: 'монгол' };
const LANG_NAME_EN = { en: 'English', mn: 'Mongolian' };

// ──────────────────────────────────────────────────────────────────
// GOOGLE TRANSLATE (free, unofficial endpoint)
// ──────────────────────────────────────────────────────────────────
async function translateWithGoogle(text, fromLang, toLang) {
  // The unofficial endpoint accepts ~5000 chars at once. Split longer texts
  // on sentence boundaries to stay under the limit.
  const CHUNK_LIMIT = 4500;
  const chunks = [];
  if (text.length <= CHUNK_LIMIT) {
    chunks.push(text);
  } else {
    let buf = '';
    const sentences = text.split(/(?<=[.!?。！？\n])\s+/);
    for (const s of sentences) {
      if ((buf + s).length > CHUNK_LIMIT && buf) { chunks.push(buf); buf = ''; }
      buf += (buf ? ' ' : '') + s;
    }
    if (buf) chunks.push(buf);
  }

  const out = [];
  for (const chunk of chunks) {
    const url = `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=${encodeURIComponent(fromLang)}&tl=${encodeURIComponent(toLang)}` +
      `&dt=t&q=${encodeURIComponent(chunk)}`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TradingApp/1.0)' },
    });
    if (!r.ok) throw new Error(`Google ${r.status}`);
    const data = await r.json();
    // data[0] is an array of [translated, original, ...] tuples
    const parts = (data[0] || []).map((row) => row[0]).filter(Boolean);
    out.push(parts.join(''));
  }
  return out.join('\n').trim();
}

// ──────────────────────────────────────────────────────────────────
// CLAUDE (premium, requires ANTHROPIC_API_KEY)
// ──────────────────────────────────────────────────────────────────
async function translateWithClaude(text, fromLang, toLang, bookTitle, apiKey) {
  const userPrompt =
    `Дараах ${LANG_NAME[fromLang]} текстийг ${LANG_NAME[toLang]} (${LANG_NAME_EN[toLang]}) руу орчуул.` +
    (bookTitle ? `\n\nНомны нэр: "${bookTitle}"` : '') +
    `\n\n--- ЭХ ТЕКСТ ---\n${text}\n--- ТӨГСГӨЛ ---`;

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!r.ok) {
    const errText = await r.text();
    throw new Error(`Anthropic ${r.status}: ${errText.slice(0, 200)}`);
  }
  const data = await r.json();
  const translation = (data.content || [])
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();
  return { translation, usage: data.usage };
}

// ──────────────────────────────────────────────────────────────────
// HANDLER
// ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Use POST' }); return; }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { text, fromLang, toLang, bookTitle, provider = 'google' } = body || {};

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ error: 'text заавал' });
    return;
  }
  if (!fromLang || !toLang || fromLang === toLang) {
    res.status(400).json({ error: 'fromLang ба toLang шаардлагатай, өөр өөр байх' });
    return;
  }
  if (text.length > 30000) {
    res.status(400).json({ error: 'Текст хэт урт (макс 30000 тэмдэгт)' });
    return;
  }

  try {
    if (provider === 'claude') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        res.status(500).json({
          error: 'ANTHROPIC_API_KEY байхгүй',
          hint: 'Vercel Dashboard → Settings → Environment Variables → ANTHROPIC_API_KEY нэмнэ үү',
          fallback: 'Google орчуулагч ашиглах боломжтой (үнэгүй)',
        });
        return;
      }
      const { translation, usage } = await translateWithClaude(text, fromLang, toLang, bookTitle, apiKey);
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
      res.status(200).json({
        translation,
        provider: 'claude',
        model: MODEL,
        usage,
        cached: (usage?.cache_read_input_tokens || 0) > 0,
      });
    } else {
      const translation = await translateWithGoogle(text, fromLang, toLang);
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
      res.status(200).json({ translation, provider: 'google' });
    }
  } catch (err) {
    console.error('translate error', err);
    res.status(502).json({
      error: String(err.message || err),
      provider,
    });
  }
}
