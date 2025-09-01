# React Weather Dashboard

A clean React + Vite Weather Dashboard that shows **current conditions** and a **5‑day forecast**, with **unit toggle**, **city search with autosuggest**, **saved cities (localStorage)**, and optional **geolocation**.

## ✨ Features
- Search cities via OpenWeather Geocoding API
- Current weather + 5‑day forecast
- Celsius / Fahrenheit toggle (persists)
- Save favorite cities (persists)
- "My Location" (browser geolocation)
- Simple, responsive UI

## 🚀 Getting Started
1. **Install dependencies**
   ```bash
   npm install
   # or: pnpm install / yarn
   ```

2. **Create `.env` file** in project root:
   ```bash
   cp .env.example .env
   # then edit .env to add your key
   ```

3. **Run dev server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 🔐 Environment Variables
Create a `.env` with:
```
VITE_OPENWEATHER_API_KEY=YOUR_OPENWEATHER_KEY
```
Get a free API key from https://openweathermap.org/api

## 🧱 Project Structure
```
react-weather-dashboard/
├─ index.html
├─ package.json
├─ vite.config.js
├─ .env.example
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ styles.css
│  ├─ hooks/
│  │  └─ useLocalStorage.js
│  ├─ services/
│  │  └─ weatherApi.js
│  └─ components/
│     ├─ SearchBar.jsx
│     ├─ WeatherCard.jsx
│     ├─ Forecast.jsx
│     ├─ UnitToggle.jsx
│     └─ SavedCities.jsx
```

## 🧪 Notes
- The free OpenWeather plan has rate limits. If you hit errors while typing quickly, it's likely rate limiting—wait a few seconds and retry.
- If geolocation fails in some browsers, ensure you're using `http://localhost` or `https://` origins.
