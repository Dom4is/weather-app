import type { CurrentWeatherResponse } from "../../types/types";
import type { TemperatureUnit } from "../../types/types";

interface WeatherCardProps {
  currentWeather: CurrentWeatherResponse;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function formatTemperature(value: number, unit: TemperatureUnit) {
  const temperature = unit === "C" ? value : (value * 9) / 5 + 32;
  return Math.round(temperature);
}

export default function WeatherCard({
  currentWeather,
  unit,
  isFavorite,
  onToggleFavorite,
}: WeatherCardProps) {
  const observedAt = new Date(currentWeather.dt * 1000).toLocaleString(
    "ru-RU",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  const weather = currentWeather.weather[0];

  return (
    <section
      className="current-weather"
      aria-label={`Погода в городе ${currentWeather.name}`}
    >
      <div className="current-weather-main">
        <div className="current-weather-copy">
          <div className="current-weather-heading">
            <p className="current-label">СЕЙЧАС В ГОРОДЕ</p>
            <button
              className={`favorite-toggle${isFavorite ? " is-favorite" : ""}`}
              type="button"
              onClick={onToggleFavorite}
              aria-label={
                isFavorite ? "Убрать из избранного" : "Добавить в избранное"
              }
              aria-pressed={isFavorite}
              title={
                isFavorite ? "Убрать из избранного" : "Добавить в избранное"
              }
            >
              {isFavorite ? "★" : "☆"}
            </button>
          </div>
          <h2>{currentWeather.name}</h2>
          <p className="current-description">{weather.description}</p>
          <p className="current-date">Обновлено {observedAt}</p>
        </div>
        <div className="temperature-wrap">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="current-icon"
          />
          <p className="current-temperature">
            {formatTemperature(currentWeather.main.temp, unit)}
            <span>°{unit}</span>
          </p>
          <p className="feels-like">
            Ощущается как{" "}
            {formatTemperature(currentWeather.main.feels_like, unit)}°{unit}
          </p>
        </div>
      </div>
      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-symbol" aria-hidden="true">
            ↗
          </span>
          <span className="detail-label">Ветер</span>
          <strong>
            {currentWeather.wind.speed} <small>м/с</small>
          </strong>
        </div>
        <div className="weather-detail">
          <span className="detail-symbol humidity-symbol" aria-hidden="true">
            %
          </span>
          <span className="detail-label">Влажность</span>
          <strong>
            {currentWeather.main.humidity}
            <small>%</small>
          </strong>
        </div>
        <div className="weather-detail">
          <span className="detail-symbol rain-symbol" aria-hidden="true">
            ◌
          </span>
          <span className="detail-label">Осадки за час</span>
          <strong>
            {currentWeather.rain?.["1h"] ?? 0}
            <small> мм</small>
          </strong>
        </div>
      </div>
    </section>
  );
}
