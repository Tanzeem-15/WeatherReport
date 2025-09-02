import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaLocationArrow, FaRegStar, FaStar, FaSyncAlt } from 'react-icons/fa';
import Forecast from './components/Forecast.jsx';
import SavedCities from './components/SavedCities.jsx';
import SearchBar from './components/SearchBar.jsx';
import UnitToggle from './components/UnitToggle.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import useLocalStorage from './hooks/useLocalStorage.js';
import { getCurrentWeather, getForecast, reverseGeocode } from './services/weatherApi.js';

export default function App() {
  const [coords, setCoords] = useState(null);
  const [units, setUnits] = useLocalStorage('units', 'metric');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useLocalStorage('saved_cities', []);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isSaved = useMemo(() => {
    if (!coords) return false;
    return saved.some(
      c => Number(c.lat) === Number(coords.lat) && Number(c.lon) === Number(coords.lon),
    );
  }, [saved, coords]);

  const fetchWeather = useCallback(
    async ({ lat, lon }, unitsSel) => {
      const u = unitsSel ?? units;
      try {
        setError('');
        setLoading(true);
        const cw = await getCurrentWeather(lat, lon, u);
        const fc = await getForecast(lat, lon, u);
        setCurrent(cw);
        setForecast(fc);
        setLastUpdated(new Date());
      } catch (e) {
        console.warn(e);
        setError(e?.message || 'Failed to fetch weather.');
      } finally {
        setLoading(false);
      }
    },
    [units],
  );

  const handleSave = () => {
    if (!coords || isSaved) return;
    const next = [{ name: coords.name, lat: coords.lat, lon: coords.lon }, ...saved];
    setSaved(next);
  };

  const handleRemove = city => {
    setSaved(
      saved.filter(
        c => !(Number(c.lat) === Number(city.lat) && Number(c.lon) === Number(city.lon)),
      ),
    );
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        try {
          const city = await reverseGeocode(latitude, longitude);
          setCoords(city);
        } catch (e) {
          setError('Failed to get city name, using coordinates');
          setCoords({ name: 'My Location', lat: latitude, lon: longitude });
        }
      },
      err => setError(err?.message || 'Unable to get location'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleRefresh = async () => {
    if (!coords) return;
    await fetchWeather(coords, units);
  };

  useEffect(() => {
    if (!coords) return;
    let alive = true;
    (async () => {
      await fetchWeather(coords);
      if (!alive) return;
    })();
    return () => {
      alive = false;
    };
  }, [coords, fetchWeather]);

  useEffect(() => {
    let alive = true;
    async function detect() {
      if (!navigator.geolocation) {
        setError('Geolocation not supported');
        const fallback = { name: 'Bengaluru, IN', lat: 12.9716, lon: 77.5946 };
        if (alive) setCoords(fallback);
        setBootLoading(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const { latitude, longitude } = pos.coords;
          try {
            const city = await reverseGeocode(latitude, longitude);
            if (alive) setCoords(city);
          } catch {
            if (alive) setCoords({ name: 'My Location', lat: latitude, lon: longitude });
          } finally {
            if (alive) setBootLoading(false);
          }
        },
        err => {
          setError(err?.message || 'Unable to get location');
          const fallback = { name: 'Bengaluru, IN', lat: 12.9716, lon: 77.5946 };
          if (alive) setCoords(fallback);
          setBootLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 },
      );
    }
    detect();
    return () => {
      alive = false;
    };
  }, []);

  if (bootLoading || !coords) {
    return (
      <div className="container">
        <header className="header">
          <h1>☁️ Weather Dashboard</h1>
        </header>
        <div className="panel">
          <div className="loading">Detecting your location…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>☁️ Weather Dashboard</h1>
        <div className="header-actions">
          <UnitToggle value={units} onChange={setUnits} />
          <button className="btn location-btn" onClick={handleGeolocate} title="Use my location">
            <FaLocationArrow />
            <span>My Location</span>
          </button>
          <button
            className="btn save-btn"
            onClick={handleSave}
            disabled={!coords || isSaved}
            title="Save city"
          >
            {isSaved ? <FaStar color="gold" /> : <FaRegStar />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            className="btn refresh-btn"
            onClick={handleRefresh}
            disabled={loading || !coords}
            title="Refresh"
          >
            <FaSyncAlt />
            <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
          </button>
        </div>
      </header>

      <SearchBar onSelectCity={setCoords} />

      <main className="grid">
        <section className="panel">
          {loading && <div className="loading">Loading weather…</div>}
          {error && <div className="error">⚠️ {error}</div>}
          {!loading && current && (
            <WeatherCard
              data={current}
              units={units}
              cityName={coords.name}
              lastUpdated={lastUpdated}
            />
          )}
        </section>

        <section className="panel">
          {!loading && forecast && <Forecast data={forecast} units={units} />}
        </section>

        <aside className="panel">
          <SavedCities
            cities={saved}
            onSelect={setCoords}
            onRemove={handleRemove}
            active={coords || undefined}
          />
        </aside>
      </main>

      <footer className="footer">
        <small>Built with React + Vite • Uses OpenWeather APIs</small>
      </footer>
    </div>
  );
}
