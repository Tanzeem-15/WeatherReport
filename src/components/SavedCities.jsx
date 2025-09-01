import React, { memo } from "react";
import { List } from "react-window";


const ROW_HEIGHT = 56;
const VISIBLE_ROWS = 3;
const VIEWPORT_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS + 8;

export default function SavedCities({ cities, onSelect, onRemove, active }) {
  const count = Array.isArray(cities) ? cities.length : 0;

  const Row = memo(function Row({
    index,
    style,
    items,
    onSelect,
    onRemove,
    active,
  }) {
    const c = items[index];
    const isActive =
      !!active &&
      Number(c.lat) === Number(active.lat) &&
      Number(c.lon) === Number(active.lon);

    return (
      <div style={{ ...style, padding: "4px 0" }}>
        <div className={isActive ? "saved-item active" : "saved-item"}>
          <button
            className="saved-name"
            onClick={() => onSelect(c)}
            title={c.name}
          >
            {c.name}
          </button>
          <button
            className="icon-btn"
            title="Remove"
            onClick={() => onRemove(c)}
          >
            ✕
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="card">
      <div className="card-header">
        <h2>Saved Cities</h2>
      </div>

      {count === 0 ? (
        <div className="muted">No cities saved yet.</div>
      ) : (
         <div className="saved-viewport" style={{ height: VIEWPORT_HEIGHT }}>
          <List
            height={VIEWPORT_HEIGHT}
            width="100%"
            rowComponent={Row}
            rowCount={count}
            rowHeight={ROW_HEIGHT}
            rowProps={{ items: cities, onSelect, onRemove, active }}
            overscanCount={2}
          />
        </div>
      )}
    </div>
  );
}
