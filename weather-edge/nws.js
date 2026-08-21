// Minimal NWS (api.weather.gov) client. Free, no key; requires a User-Agent.
const { nwsBase } = require("./config");

const UA = "weather-edge-research (personal project)";

async function getJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/geo+json" },
  });
  if (!res.ok) throw new Error(`NWS ${res.status} for ${url}`);
  return res.json();
}

// lat/lon -> gridpoint hourly forecast URL, then the hourly series itself.
async function getHourlyForecast(lat, lon) {
  const point = await getJson(`${nwsBase}/points/${lat.toFixed(4)},${lon.toFixed(4)}`);
  const hourlyUrl = point.properties.forecastHourly;
  const forecast = await getJson(hourlyUrl);
  return forecast.properties.periods; // [{startTime, temperature, ...}]
}

// Forecast daily max temp (deg F) for a calendar date in the city's timezone.
// Returns { maxF, leadHours } where leadHours is time from now until the
// expected hour of the max — that drives which sigma applies.
function forecastHighForDate(periods, dateStr, timezone) {
  let maxF = -Infinity;
  let maxTime = null;
  for (const p of periods) {
    const t = new Date(p.startTime);
    const localDate = t.toLocaleDateString("en-CA", { timeZone: timezone }); // YYYY-MM-DD
    if (localDate !== dateStr) continue;
    if (typeof p.temperature === "number" && p.temperature > maxF) {
      maxF = p.temperature;
      maxTime = t;
    }
  }
  if (maxF === -Infinity) return null;
  const leadHours = Math.max(0, (maxTime - Date.now()) / 3.6e6);
  return { maxF, leadHours };
}

module.exports = { getHourlyForecast, forecastHighForDate };
