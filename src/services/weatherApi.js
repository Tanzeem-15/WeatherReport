const API_BASE = 'https://api.openweathermap.org';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function ensureKey() {
  if (!API_KEY) {
    throw new Error(
      'Missing OpenWeather API key. Create a .env file with VITE_OPENWEATHER_API_KEY=YOUR_KEY',
    );
  }
}

export async function searchCity(query, limit = 5) {
  ensureKey();
  const url = `${API_BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to search city');
  const data = await res.json();
  return data.map(({ name, lat, lon, state, country }) => ({
    name: [name, state, country].filter(Boolean).join(', '),
    lat,
    lon,
  }));
}

export async function getCurrentWeather(lat, lon, units = 'metric') {
  ensureKey();
  const url = `${API_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch current weather');
  const data = await res.json();
  return normalizeCurrent(data);
}

export async function getForecast(lat, lon, units = 'metric') {
  ensureKey();
  const url = `${API_BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch forecast');
  const data = await res.json();
  return normalizeForecast(data);
}

function normalizeCurrent(d) {
  return {
    dt: d.dt * 1000,
    temp: d.main?.temp,
    feels_like: d.main?.feels_like,
    humidity: d.main?.humidity,
    pressure: d.main?.pressure,
    wind_speed: d.wind?.speed,
    wind_deg: d.wind?.deg,
    description: d.weather?.[0]?.description ?? '',
    icon: d.weather?.[0]?.icon ?? '01d',
  };
}

function normalizeForecast(d) {
  const byDate = {};
  for (const item of d.list || []) {
    const date = item.dt_txt.split(' ')[0];
    const hour = Number(item.dt_txt.split(' ')[1].split(':')[0]);
    if (!byDate[date] || Math.abs(hour - 12) < Math.abs(byDate[date].hour - 12)) {
      byDate[date] = {
        hour,
        dt: item.dt * 1000,
        temp: item.main?.temp,
        description: item.weather?.[0]?.description ?? '',
        icon: item.weather?.[0]?.icon ?? '01d',
      };
    }
  }
  const days = Object.entries(byDate)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.dt - b.dt);
  return days.slice(0, 5);
}

export async function reverseGeocode(lat, lon) {
  ensureKey();
  const url = `${API_BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to reverse geocode location');
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    return { name: 'Unknown Location', lat, lon };
  }
  const { name, state, country } = data[0];
  return { name: [name, state, country].filter(Boolean).join(', '), lat, lon };
}
