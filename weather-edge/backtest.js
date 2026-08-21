#!/usr/bin/env node
// Backtest / calibration harness.
//
// Pulls SETTLED Kalshi weather markets and scores how well the market's own
// closing prices predicted outcomes (Brier score + calibration table). This
// is the baseline your model must beat: if you can't out-forecast the close,
// there is no edge.
//
//   node weather-edge/backtest.js KXHIGHNY [limit]
//
// To score YOUR model point-in-time (the part that actually validates the
// edge), you also need archived forecasts as they existed before each day —
// see README step 2 for sources (IEM MOS/NBM archives). This file gives you
// the outcome + market-price side; join your forecast archive onto it.

const { getSettledMarkets } = require("./kalshi");

function brier(pairs) {
  // pairs: [{p, outcome}] with p in [0,1], outcome 0/1
  return pairs.reduce((s, x) => s + (x.p - x.outcome) ** 2, 0) / pairs.length;
}

async function main() {
  const series = process.argv[2] || "KXHIGHNY";
  const limit = Number(process.argv[3] || 500);
  const markets = await getSettledMarkets(series, limit);
  const pairs = [];

  for (const m of markets) {
    // last_price is the final trade before settlement; a better baseline is a
    // candlestick close at a fixed time-of-day (see /series/.../candlesticks).
    if (m.last_price == null || m.result == null) continue;
    if (m.last_price <= 0 || m.last_price >= 100) continue;
    pairs.push({ p: m.last_price / 100, outcome: m.result === "yes" ? 1 : 0, t: m.ticker });
  }

  if (!pairs.length) {
    console.log("No settled markets with usable prices found.");
    return;
  }

  console.log(`${series}: ${pairs.length} settled contracts`);
  console.log(`Market Brier score (last price): ${brier(pairs).toFixed(4)}`);
  console.log("(Lower is better. ~0.25 = coin flip, well-calibrated markets ~0.10-0.15\n on bucketed weather. Your model must beat this out-of-sample.)");

  // Calibration table: within each price decile, did outcomes match frequency?
  console.log("\nCalibration (price bucket -> observed YES frequency):");
  for (let lo = 0; lo < 100; lo += 10) {
    const bin = pairs.filter((x) => x.p * 100 >= lo && x.p * 100 < lo + 10);
    if (!bin.length) continue;
    const freq = bin.reduce((s, x) => s + x.outcome, 0) / bin.length;
    console.log(
      `  ${String(lo).padStart(2)}-${lo + 9}c: n=${String(bin.length).padStart(4)}  observed ${(freq * 100).toFixed(1)}%`
    );
  }
  console.log(
    "\nIf observed frequencies track the price buckets closely, the market is\n" +
    "well-calibrated and any edge must come from being FASTER or MORE LOCAL\n" +
    "than the crowd, not from systematic mispricing."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
