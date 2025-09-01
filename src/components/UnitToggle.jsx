import React from 'react';

export default function UnitToggle({ value, onChange }) {
  return (
    <div className="segmented">
      <button
        className={value === 'metric' ? 'seg active' : 'seg'}
        onClick={() => onChange('metric')}
        title="Celsius"
      >
        °C
      </button>
      <button
        className={value === 'imperial' ? 'seg active' : 'seg'}
        onClick={() => onChange('imperial')}
        title="Fahrenheit"
      >
        °F
      </button>
    </div>
  );
}
