// Vercel serverless function: translates forex/trading text via Claude API.
// Uses prompt caching on the system prompt so subsequent calls are ~75% cheaper.
//
// POST /api/translate
// body: { text: string, fromLang: 'en'|'mn', toLang: 'en'|'mn', bookTitle?: string }
// returns: { translation: string, model: string, cached: boolean, usage: {...} }
//
// Requires ANTHROPIC_API_KEY env var (set in Vercel dashboard).

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

export default async function handler(req, res) {
  // CORS for safety (works fine same-origin too)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'ANTHROPIC_API_KEY байхгүй',
      hint: 'Vercel Dashboard → Settings → Environment Variables → ANTHROPIC_API_KEY нэмнэ үү',
    });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { text, fromLang, toLang, bookTitle } = body || {};

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

  const userPrompt =
    `Дараах ${LANG_NAME[fromLang]} текстийг ${LANG_NAME[toLang]} (${LANG_NAME_EN[toLang]}) руу орчуул.` +
    (bookTitle ? `\n\nНомны нэр: "${bookTitle}"` : '') +
    `\n\n--- ЭХ ТЕКСТ ---\n${text}\n--- ТӨГСГӨЛ ---`;

  try {
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
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('Anthropic API error', r.status, errText);
      res.status(502).json({
        error: `Anthropic API ${r.status}`,
        details: errText.slice(0, 500),
      });
      return;
    }

    const data = await r.json();
    const translation = (data.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n')
      .trim();

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).json({
      translation,
      model: MODEL,
      usage: data.usage,
      cached: (data.usage?.cache_read_input_tokens || 0) > 0,
    });
  } catch (err) {
    console.error('translate error', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
