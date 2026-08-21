// Probability model + edge math.
//
// Settlement is the INTEGER daily high from the NWS CLI report. We model the
// true high as Normal(mu = forecast high, sigma = f(lead time)) and integrate
// over each contract's bucket with a +/-0.5 continuity correction for the
// rounding to integers.
//
// Bucket semantics (verify per-market against Kalshi's rules page!):
//   floor & cap present  -> YES iff floor <= high <= cap   (e.g. "83-84")
//   only floor           -> YES iff high >= floor           ("83 or above")
//   only cap             -> YES iff high <= cap             ("77 or below")

const { feeCents } = require("./kalshi");
const config = require("./config");

// Abramowitz-Stegun erf approximation; plenty accurate for this use.
function erf(x) {
  const s = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-x * x);
  return s * y;
}

const normCdf = (x, mu, sigma) => 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));

function sigmaForLead(leadHours) {
  for (const row of config.sigmaByLeadHours) {
    if (leadHours <= row.maxLeadHours) return row.sigma;
  }
  return config.sigmaByLeadHours.at(-1).sigma;
}

function bucketProbability(market, mu, sigma) {
  const floor = market.floor_strike;
  const cap = market.cap_strike;
  const lo = floor != null ? normCdf(floor - 0.5, mu, sigma) : 0;
  const hi = cap != null ? normCdf(cap + 0.5, mu, sigma) : 1;
  return Math.max(0, hi - lo);
}

// Evaluate one market. Prices in cents. Returns null when the book is
// unusable (empty or too wide) — a price you can't trade at is not a signal.
function evaluateMarket(market, mu, sigma) {
  const yesAsk = market.yes_ask;
  const yesBid = market.yes_bid;
  if (!yesAsk || yesAsk >= 100 || yesBid == null) return null;
  const spread = yesAsk - yesBid;
  if (spread > config.maxSpreadCents) return null;

  const p = bucketProbability(market, mu, sigma);

  // Buy YES at the ask; buy NO at (100 - yes_bid). EV in cents per contract.
  const noAsk = 100 - yesBid;
  const evYes = p * 100 - yesAsk - feeCents(yesAsk);
  const evNo = (1 - p) * 100 - noAsk - feeCents(noAsk);

  const side = evYes >= evNo ? "YES" : "NO";
  const ev = Math.max(evYes, evNo);
  return {
    ticker: market.ticker,
    subtitle: market.yes_sub_title || market.subtitle || "",
    floor: market.floor_strike ?? null,
    cap: market.cap_strike ?? null,
    modelProb: p,
    marketMid: (yesBid + yesAsk) / 2,
    yesBid,
    yesAsk,
    spread,
    side,
    evCents: ev,
    actionable: ev >= config.minEdgeCents,
  };
}

module.exports = { evaluateMarket, bucketProbability, sigmaForLead, normCdf };
