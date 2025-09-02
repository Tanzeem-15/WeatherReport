import React from 'react';

function degToCompass(num) {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  return arr[val % 16] || 'N';
}

export default function WeatherCard({ data, units, cityName, lastUpdated }) {
  const unitSymbol = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <div className="card">
      <div className="card-header">
        <h2>{cityName}</h2>
        <time className="muted" style={{ fontSize: 25 }}>
          {lastUpdated.toLocaleString()}
        </time>
      </div>

      <div className="current">
        <img src={iconUrl} alt={data.description} width="80" height="80" />
        <div className="temp">
          <div className="now">
            {Math.round(data.temp)}
            {unitSymbol}
          </div>
          <div className="desc">{data.description}</div>
          <div className="feels">
            Feels like {Math.round(data.feels_like)}
            {unitSymbol}
          </div>
        </div>
      </div>

      <div className="metrics">
        <div>
          <span className="label">Humidity</span>
          <span>{data.humidity}%</span>
        </div>
        <div>
          <span className="label">Pressure</span>
          <span>{data.pressure} hPa</span>
        </div>
        <div>
          <span className="label">Wind</span>
          <span>
            {data.wind_speed} {windUnit}{' '}
            {data.wind_deg != null ? `(${degToCompass(data.wind_deg)})` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
