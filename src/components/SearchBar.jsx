import React, { useEffect, useRef, useState } from 'react';

import { searchCity } from '../services/weatherApi.js';

export default function SearchBar({ onSelectCity }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        setError('');
        setLoading(true);
        const r = await searchCity(q, 6);
        setResults(r);
      } catch (e) {
        setError(e?.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => timer.current && clearTimeout(timer.current);
  }, [q]);

  const handlePick = (city) => {
    onSelectCity(city);
    setQ(city.name);
    setResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results[0]) handlePick(results[0]);
  };

  return (
    <div className="search">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Search city (e.g., Bengaluru, London, Tokyo)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search city"
        />
        {/* <button className="btn search-btn" type="submit">Search</button> */}
      </form>
      {loading && <div className="muted">Searching…</div>}
      {error && <div className="error">⚠️ {error}</div>}
      {results.length > 0 && (
        <ul className="dropdown">
          {results.map((c, idx) => (
            <li key={idx}>
              <button className="link" onClick={() => handlePick(c)}>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
