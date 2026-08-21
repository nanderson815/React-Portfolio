#!/usr/bin/env node
// Edge scanner: compare NWS forecast-implied probabilities to Kalshi prices.
//
//   node weather-edge/run.js              live scan, all configured cities
//   node weather-edge/run.js --city NY    live scan, cities matching "NY"
//   node weather-edge/run.js --sample     run against bundled sample snapshot
//                                         (synthetic data — for testing the
//                                         math offline, NOT a trade signal)

const fs = require("fs");
const path = require("path");
const config = require("./config");
const { getOpenEvents } = require("./kalshi");
const { getHourlyForecast, forecastHighForDate } = require("./nws");
const { evaluateMarket, sigmaForLead } = require("./model");

const args = process.argv.slice(2);
const useSample = args.includes("--sample");
const cityFilter = args.includes("--city")
  ? args[args.indexOf("--city") + 1]?.toLowerCase()
  : null;

// Event ticker suffix like 26AUG22 -> local calendar date YYYY-MM-DD.
function dateFromEventTicker(eventTicker) {
  const m = eventTicker.match(/-(\d{2})([A-Z]{3})(\d{2})/);
  if (!m) return null;
  const months = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
                   JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12" };
  return `20${m[1]}-${months[m[2]]}-${m[3]}`;
}

function fmtRow(r) {
  const bucket =
    r.floor != null && r.cap != null ? `${r.floor}-${r.cap}` :
    r.floor != null ? `>=${r.floor}` :
    r.cap != null ? `<=${r.cap}` : "?";
  const flag = r.actionable ? "  <-- EDGE" : "";
  return (
    `  ${bucket.padEnd(8)} model ${(r.modelProb * 100).toFixed(1).padStart(5)}%` +
    `  mkt ${String(r.yesBid).padStart(2)}/${String(r.yesAsk).padEnd(3)}` +
    `  ${r.side.padEnd(3)} EV ${r.evCents >= 0 ? "+" : ""}${r.evCents.toFixed(1)}c${flag}`
  );
}

async function scanCity(city, loadEvents, loadForecast) {
  const events = await loadEvents(city);
  if (!events.length) {
    console.log(`\n${city.name}: no open events found`);
    return [];
  }
  const periods = await loadForecast(city);
  const findings = [];

  for (const event of events) {
    const dateStr = dateFromEventTicker(event.event_ticker);
    if (!dateStr) continue;
    const fc = forecastHighForDate(periods, dateStr, city.timezone);
    if (!fc) continue; // date beyond hourly forecast horizon (~6.5 days)

    const sigma = sigmaForLead(fc.leadHours);
    console.log(
      `\n${city.name} — ${event.event_ticker} (${dateStr})` +
      `\n  forecast high ${fc.maxF}F, lead ${fc.leadHours.toFixed(0)}h, sigma ${sigma}F`
    );

    const markets = event.markets || [];
    for (const mkt of markets) {
      const r = evaluateMarket(mkt, fc.maxF, sigma);
      if (!r) continue;
      console.log(fmtRow(r));
      if (r.actionable) findings.push({ city: city.name, date: dateStr, ...r });
    }
  }
  return findings;
}

async function main() {
  let loadEvents, loadForecast;

  if (useSample) {
    const snap = JSON.parse(
      fs.readFileSync(path.join(__dirname, "sample", "snapshot.json"), "utf8")
    );
    console.log(`SAMPLE MODE — synthetic snapshot (${snap.note})`);
    loadEvents = (city) => Promise.resolve(snap.eventsBySeries[city.seriesTicker] || []);
    loadForecast = (city) => Promise.resolve(snap.forecastBySeries[city.seriesTicker] || []);
  } else {
    loadEvents = (city) => getOpenEvents(city.seriesTicker);
    loadForecast = (city) => getHourlyForecast(city.lat, city.lon);
  }

  const cities = config.cities.filter(
    (c) => !cityFilter || c.name.toLowerCase().includes(cityFilter) ||
           c.seriesTicker.toLowerCase().includes(cityFilter)
  );

  const all = [];
  for (const city of cities) {
    try {
      all.push(...(await scanCity(city, loadEvents, loadForecast)));
    } catch (err) {
      console.error(`\n${city.name}: ${err.message}`);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  if (all.length) {
    console.log(`${all.length} candidate(s) with EV >= ${config.minEdgeCents}c after fees:`);
    for (const f of all) {
      console.log(`  ${f.city} ${f.date} ${f.ticker} ${f.side} @ EV +${f.evCents.toFixed(1)}c`);
    }
    console.log(
      "\nCandidates are NOT validated edge. Before risking money, run the\n" +
      "backtest (backtest.js) and read README.md — especially the sections\n" +
      "on sigma calibration and adverse selection."
    );
  } else {
    console.log("No candidates above the EV threshold.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
