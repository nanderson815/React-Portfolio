// Minimal Kalshi public market-data client (no auth needed for read-only).
const { kalshiBase } = require("./config");

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Kalshi ${res.status} for ${url}`);
  return res.json();
}

// Open events for a series (one event per settlement day, e.g. KXHIGHNY-26AUG22).
async function getOpenEvents(seriesTicker) {
  const url = `${kalshiBase}/events?status=open&series_ticker=${encodeURIComponent(seriesTicker)}&with_nested_markets=true`;
  const data = await getJson(url);
  return data.events || [];
}

// Markets for an event, if not nested in the event response.
async function getMarkets(eventTicker) {
  const url = `${kalshiBase}/markets?event_ticker=${encodeURIComponent(eventTicker)}&status=open`;
  const data = await getJson(url);
  return data.markets || [];
}

// Settled markets for a series — the raw material for backtesting.
// Kalshi paginates with a cursor; walk it until exhausted or `limit` reached.
async function getSettledMarkets(seriesTicker, limit = 500) {
  const out = [];
  let cursor = "";
  while (out.length < limit) {
    const url =
      `${kalshiBase}/markets?series_ticker=${encodeURIComponent(seriesTicker)}` +
      `&status=settled&limit=100${cursor ? `&cursor=${cursor}` : ""}`;
    const data = await getJson(url);
    out.push(...(data.markets || []));
    cursor = data.cursor;
    if (!cursor || !(data.markets || []).length) break;
  }
  return out.slice(0, limit);
}

// Kalshi taker fee, cents per contract: ceil(7% * price * (1 - price) * 100).
// Verify against the current fee schedule before sizing anything real.
function feeCents(priceCents) {
  const p = priceCents / 100;
  return Math.ceil(7 * p * (1 - p));
}

module.exports = { getOpenEvents, getMarkets, getSettledMarkets, feeCents };
