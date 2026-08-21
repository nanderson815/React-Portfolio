// City configuration: Kalshi series ticker -> NWS settlement station.
//
// Kalshi's daily high-temperature markets settle on the integer high (deg F)
// printed in the NWS Climatological Report (CLI) for a SPECIFIC station.
// Forecasting the wrong station (e.g. LaGuardia instead of Central Park)
// is the #1 way to fool yourself into seeing an edge that isn't there.
//
// Verify tickers before trading — Kalshi renames series occasionally:
//   GET https://api.elections.kalshi.com/trade-api/v2/series?category=Climate%20and%20Weather

module.exports = {
  cities: [
    {
      name: "New York City",
      seriesTicker: "KXHIGHNY",
      station: "KNYC", // Central Park
      lat: 40.7829,
      lon: -73.9654,
      timezone: "America/New_York",
    },
    {
      name: "Chicago",
      seriesTicker: "KXHIGHCHI",
      station: "KMDW", // Midway
      lat: 41.7868,
      lon: -87.7522,
      timezone: "America/Chicago",
    },
    {
      name: "Miami",
      seriesTicker: "KXHIGHMIA",
      station: "KMIA",
      lat: 25.7959,
      lon: -80.287,
      timezone: "America/New_York",
    },
    {
      name: "Austin",
      seriesTicker: "KXHIGHAUS",
      station: "KATT", // Camp Mabry
      lat: 30.3208,
      lon: -97.7604,
      timezone: "America/Chicago",
    },
    {
      name: "Denver",
      seriesTicker: "KXHIGHDEN",
      station: "KDEN",
      lat: 39.8466,
      lon: -104.6562,
      timezone: "America/Denver",
    },
    {
      name: "Los Angeles",
      seriesTicker: "KXHIGHLAX",
      station: "KLAX",
      lat: 33.9382,
      lon: -118.3866,
      timezone: "America/Los_Angeles",
    },
    {
      name: "Philadelphia",
      seriesTicker: "KXHIGHPHIL",
      station: "KPHL",
      lat: 39.8683,
      lon: -75.2311,
      timezone: "America/New_York",
    },
  ],

  // Std dev (deg F) of NWS point-forecast error for the daily high, by hours
  // until the forecast day's afternoon max. These are reasonable literature
  // priors — REPLACE THEM with values you measure yourself in the backtest
  // (see README, step 2). Using someone else's sigma is not a validated edge.
  sigmaByLeadHours: [
    { maxLeadHours: 6, sigma: 1.2 },   // same afternoon, high nearly locked in
    { maxLeadHours: 18, sigma: 1.8 },  // morning of
    { maxLeadHours: 30, sigma: 2.4 },  // day before
    { maxLeadHours: 54, sigma: 3.1 },  // two days out
    { maxLeadHours: 78, sigma: 3.9 },
    { maxLeadHours: Infinity, sigma: 4.8 },
  ],

  // Only flag a trade when expected value after fees exceeds this (cents/contract).
  minEdgeCents: 5,

  // Ignore quotes wider than this (cents); a 15c-wide book has no real price.
  maxSpreadCents: 12,

  kalshiBase: "https://api.elections.kalshi.com/trade-api/v2",
  nwsBase: "https://api.weather.gov",
};
