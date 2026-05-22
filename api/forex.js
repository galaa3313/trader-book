// Vercel serverless function proxying Frankfurter (ECB) for forex rates.
// Returns: { now: { USD: 1, ... }, prev: { ... }, currentDate, previousDate }
// Falls back to /latest only if historical fetch fails — change values will be ~0.

function fmtDate(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function fetchJson(url, label) {
  const r = await fetch(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'TradingApp/1.0' } });
  if (!r.ok) throw new Error(`${label} HTTP ${r.status}`);
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Build previous-day URL — 7 days ago is guaranteed to be a prior business day
  // (Frankfurter returns the closest previous business day for any given date)
  const prevDate = new Date();
  prevDate.setUTCDate(prevDate.getUTCDate() - 7);
  const prevStr = fmtDate(prevDate);

  try {
    const [now, prev] = await Promise.all([
      fetchJson('https://api.frankfurter.app/latest?from=USD', 'frankfurter latest'),
      fetchJson(`https://api.frankfurter.app/${prevStr}?from=USD`, 'frankfurter prev'),
    ]);

    if (!now.rates || !prev.rates) throw new Error('Invalid Frankfurter response');

    res.status(200).json({
      now: { USD: 1, ...now.rates },
      prev: { USD: 1, ...prev.rates },
      currentDate: now.date,
      previousDate: prev.date,
    });
    return;
  } catch (err) {
    // Fallback 1: only /latest — change values will be 0 but ханш will display
    try {
      const now = await fetchJson('https://api.frankfurter.app/latest?from=USD', 'frankfurter latest (fallback)');
      if (!now.rates) throw new Error('Invalid');
      res.status(200).json({
        now: { USD: 1, ...now.rates },
        prev: { USD: 1, ...now.rates },
        currentDate: now.date,
        previousDate: now.date,
        warning: 'Previous rates unavailable — change values will be ~0',
        originalError: String(err.message || err),
      });
      return;
    } catch (err2) {
      // Fallback 2: open.er-api.com (different free provider, no key)
      try {
        const er = await fetchJson('https://open.er-api.com/v6/latest/USD', 'open.er-api');
        if (!er.rates) throw new Error('Invalid');
        res.status(200).json({
          now: { USD: 1, ...er.rates },
          prev: { USD: 1, ...er.rates },
          currentDate: er.time_last_update_utc || new Date().toUTCString(),
          previousDate: er.time_last_update_utc || new Date().toUTCString(),
          warning: 'Using open.er-api.com fallback — change values will be ~0',
          originalError: String(err.message || err),
        });
        return;
      } catch (err3) {
        res.status(502).json({
          error: 'All forex providers failed',
          attempts: {
            frankfurterCombined: String(err.message || err),
            frankfurterLatest: String(err2.message || err2),
            openErApi: String(err3.message || err3),
          },
        });
      }
    }
  }
}
