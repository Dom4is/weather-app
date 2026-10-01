import { useState } from "react";
import type { TemperatureUnit } from "../../types/types";

interface SearchCityProps {
  onSearch: (query: string) => Promise<void>;
  onLocate: () => void;
  isLoading: boolean;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
}

export default function SearchCity({
  onSearch,
  onLocate,
  isLoading,
  unit,
  onUnitChange,
}: SearchCityProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="search-tools">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const city = query.trim();
          if (city && !isLoading) void onSearch(city);
        }}
        className="city-search"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите город"
          aria-label="Название города"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          aria-label="Найти город"
        >
          {isLoading ? "Ищем..." : "Найти"}
          <span aria-hidden="true">↗</span>
        </button>
      </form>
      <button
        className="location-button"
        type="button"
        onClick={onLocate}
        disabled={isLoading}
        aria-label="Показать погоду рядом со мной"
        title="Моё местоположение"
      >
        ◎
      </button>
      <div
        className="unit-toggle"
        role="group"
        aria-label="Единицы температуры"
      >
        {(["C", "F"] as const).map((temperatureUnit) => (
          <button
            key={temperatureUnit}
            type="button"
            aria-pressed={unit === temperatureUnit}
            onClick={() => onUnitChange(temperatureUnit)}
          >
            °{temperatureUnit}
          </button>
        ))}
      </div>
    </div>
  );
}
