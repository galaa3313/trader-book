// Vercel serverless function proxying Yahoo Finance for indices + metals.
// Usage: /api/quotes?symbols=GC=F,SI=F,^GSPC,^IXIC,^DJI,^GDAXI,^N225,^FTSE

export default async function handler(req, res) {
  const raw = (req.query && req.query.symbols) || '';
  const symbols = raw.split(',').map(s => s.trim()).filter(Boolean).slice(0, 30);

  if (!symbols.length) {
    res.status(400).json({ error: 'symbols query param required' });
    return;
  }

  const results = await Promise.all(symbols.map(async (sym) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=5d`;
      const r = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TradingApp/1.0)',
          'Accept': 'application/json',
        },
      });
      if (!r.ok) return { sym, error: `HTTP ${r.status}` };
      const data = await r.json();
      const result = data && data.chart && data.chart.result && data.chart.result[0];
      if (!result || !result.meta) return { sym, error: 'no data' };
      const price = result.meta.regularMarketPrice;
      const prevClose = result.meta.chartPreviousClose ?? result.meta.previousClose;
      return { sym, price, prevClose };
    } catch (e) {
      return { sym, error: String(e && e.message || e) };
    }
  }));

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=180');
  res.status(200).json(results);
}
