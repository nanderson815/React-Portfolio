# Weather Edge Validation

Pipeline for testing whether Kalshi daily high-temperature contracts are
mispriced relative to NWS forecast data.

## How it works

1. **`kalshi.js`** pulls open events/markets for each city's high-temp series
   (`KXHIGHNY`, `KXHIGHCHI`, …) from Kalshi's free public market-data API.
2. **`nws.js`** pulls the NWS hourly forecast for each contract's *settlement
   station* (Central Park for NYC, Midway for Chicago, etc.) and extracts the
   forecast daily high.
3. **`model.js`** treats the true high as `Normal(forecast, σ(lead time))`,
   integrates over each contract's temperature bucket (with a ±0.5° continuity
   correction, since settlement is the integer high from the NWS CLI report),
   and compares that probability to the tradeable price — ask, not mid —
   minus Kalshi's ~7%·p·(1−p) taker fee.
4. **`run.js`** prints every priced bucket and flags contracts whose expected
   value after fees clears `minEdgeCents`.

```bash
node weather-edge/run.js            # live scan, all cities
node weather-edge/run.js --city NY  # one city
node weather-edge/run.js --sample   # offline demo on synthetic data
node weather-edge/backtest.js KXHIGHNY 500   # market calibration baseline
```

No dependencies; Node 18+. NWS requires only a User-Agent header; Kalshi
market data requires no auth.

## What "validated edge" actually requires

A scanner flagging today's divergences is a **candidate generator**, not
validation. Divergence between your model and the market has two possible
explanations — the market is wrong, or *your model* is wrong — and on any
single day you cannot tell which. Validation is the process of ruling out
the second explanation. In order:

### 1. Beat the market's own calibration baseline

Run `backtest.js`. It scores hundreds of *settled* contracts: Brier score of
the market's final prices plus a calibration table. Kalshi weather markets
are traded by people running exactly this NWS-vs-price comparison, so expect
decent calibration. Your edge, if it exists, must show up as your model's
Brier score beating the market's **at the same point in time** — e.g. both
measured at 9am the day of settlement.

### 2. Backtest point-in-time, never with today's data

The cardinal sin is scoring your model with forecasts that weren't available
when the market was priced. You need **archived forecasts as they existed
then**:

- Iowa Environmental Mesonet archives NWS MOS and NBM guidance:
  `https://mesonet.agron.iastate.edu/mos/` (station KNYC etc., every cycle).
- Actual settlements: NWS CLI reports (also archived on IEM), or just the
  `result` field on Kalshi's settled markets.
- Historical intraday prices: Kalshi's
  `GET /series/{series}/markets/{ticker}/candlesticks` endpoint.

Join the three on (station, date, time-of-day) and score: model probability
vs. market price vs. outcome, at a *fixed decision time* you could actually
trade at.

### 3. Measure σ yourself — it's the whole model

The sigmas in `config.js` are literature-flavored priors. The real
forecast-error distribution is station- and season-specific (Central Park in
a sea-breeze regime is not Denver in a downslope wind event), slightly
fat-tailed, and sometimes biased (forecasts can run systematically warm or
cool at specific stations). From the archive in step 2, fit per-station,
per-lead-time error distributions — mean bias AND spread — and replace the
normal assumption if the tails demand it. **A mis-specified σ manufactures
fake edge in the tail buckets**, which is exactly where the scanner will
otherwise send you.

### 4. Simulate the P&L, not the probabilities

Convert backtest signals into simulated trades at the historical **ask**
(candlesticks give you OHLC of bid/ask), subtract taker fees, and look at:

- Total and per-trade P&L with confidence intervals (bootstrap the days —
  outcomes within a day are heavily correlated across buckets, so N days,
  not N contracts, is your effective sample size).
- Drawdowns and the fraction of P&L coming from the best 5 days. Edge
  concentrated in a handful of days is fragile.
- Sensitivity: does P&L survive σ ± 20%? An edge that only exists for one
  precise σ is curve-fit.

### 5. Respect the microstructure

- **Trade at the ask, count the fee.** A 4-cent model edge at a 5-cent
  spread plus 2-cent fee is negative EV. `run.js` already refuses to score
  quotes wider than `maxSpreadCents`.
- **Adverse selection**: resting orders in weather markets get picked off
  when a new model cycle (HRRR/NBM) drops. If your fills mostly happen right
  before the price moves against you, your realized edge will be far below
  backtest.
- **Capacity**: these books are thin. Check open interest and depth; an edge
  worth 6 cents on 50 contracts is a hobby, not a strategy.
- **Position limits & taxes** apply; Kalshi P&L is taxable income.

### 6. Guard against multiple comparisons

Seven cities × ~8 buckets × daily = thousands of comparisons a season.
Some will look mispriced by luck. Fix the decision rule *before* the
out-of-sample test, hold out a time period untouched until the end, and
demand the edge survives it.

## Where real edge plausibly lives (and doesn't)

Unlikely: raw "NWS says 84, market implies 83" divergence at midday — every
serious participant sees the same free feed within seconds.

More plausible, all testable with this scaffold:

- **Speed at model-cycle boundaries**: repricing within seconds of a new
  NBM/HRRR run or a METAR observation that locks in the high (e.g. the 2pm
  ob already exceeds the top of a bucket the market still prices at 15c).
- **Station quirks**: settlement stations with microclimates the consensus
  forecast handles poorly (Central Park's canopy, LAX's marine layer burn-off,
  Denver's chinooks). Per-station bias fitting in step 3 finds these.
- **Tail buckets late in the day**: once hourly obs constrain the max, the
  true distribution collapses much faster than casual traders update.
- **Retail flow**: event-market retail tends to overbuy longshots; test
  whether 1–5c buckets are systematically overpriced (the calibration table
  in `backtest.js` shows this directly).

## Caveats

- Verify each market's bucket semantics (`floor_strike`/`cap_strike`
  inclusivity) against its rules page; this code assumes inclusive bounds.
- Verify series tickers and the fee schedule — both change occasionally.
- Sample snapshot under `sample/` is synthetic, for testing the math only.
- Nothing here is financial advice; it's a measurement harness.
