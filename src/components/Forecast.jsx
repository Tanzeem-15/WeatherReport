import React from 'react';

export default function Forecast({ data, units }) {
  const unitSymbol = units === 'metric' ? '°C' : '°F';
  return (
    <div className="card">
      <div className="card-header">
        <h2>5-Day Forecast</h2>
      </div>
      <div className="forecast">
        {data.map((d, idx) => (
          <div className="forecast-item" key={idx}>
            <div className="f-date">
              {new Date(d.dt).toLocaleDateString(undefined, {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
              })}
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${d.icon}.png`}
              alt={d.description}
              width="48"
              height="48"
            />
            <div className="f-temp">
              {Math.round(d.temp)}
              {unitSymbol}
            </div>
            <div className="f-desc">{d.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
