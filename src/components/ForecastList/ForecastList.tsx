import type { ForecastItem } from "../../types/types";
import type { TemperatureUnit } from "../../types/types";

interface ForecastListProps {
  list: ForecastItem[];
  unit: TemperatureUnit;
  timezoneOffset: number;
}

function formatTemperature(value: number, unit: TemperatureUnit) {
  const temperature = unit === "C" ? value : (value * 9) / 5 + 32;
  return Math.round(temperature);
}

function getCityDate(item: ForecastItem, timezoneOffset: number) {
  return new Date((item.dt + timezoneOffset) * 1000);
}

function getCityDay(item: ForecastItem, timezoneOffset: number) {
  return getCityDate(item, timezoneOffset).toISOString().slice(0, 10);
}

export default function ForecastList({
  list,
  unit,
  timezoneOffset,
}: ForecastListProps) {
  const hourlyForecast = list.slice(0, 8);
  const forecastByDay = list
    .reduce<ForecastItem[]>((days, item) => {
      const existingIndex = days.findIndex(
        (forecast) =>
          getCityDay(forecast, timezoneOffset) ===
          getCityDay(item, timezoneOffset),
      );
      if (existingIndex === -1) {
        days.push(item);
      } else {
        const itemHour = getCityDate(item, timezoneOffset).getUTCHours();
        const existingHour = getCityDate(
          days[existingIndex],
          timezoneOffset,
        ).getUTCHours();
        if (Math.abs(itemHour - 12) < Math.abs(existingHour - 12)) {
          days[existingIndex] = item;
        }
      }
      return days;
    }, [])
    .slice(0, 5);

  if (!hourlyForecast.length) {
    return <p className="forecast-empty">Прогноз пока недоступен.</p>;
  }

  return (
    <div className="forecasts">
      <section className="hourly-section" aria-labelledby="hourly-title">
        <h3 id="hourly-title">Ближайшие 24 часа</h3>
        <ul className="hourly-list">
          {hourlyForecast.map((item) => (
            <li className="hourly-item" key={item.dt}>
              <span>
                {new Intl.DateTimeFormat("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                }).format(getCityDate(item, timezoneOffset))}
              </span>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
              />
              <strong>
                {formatTemperature(item.main.temp, unit)}°{unit}
              </strong>
              <small>{Math.round(item.pop * 100)}%</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="daily-section" aria-labelledby="daily-title">
        <h3 id="daily-title">По дням</h3>
        <ul className="forecast-list">
          {forecastByDay.map((item) => (
            <li className="forecast-day" key={item.dt}>
              <span className="forecast-date">
                {new Intl.DateTimeFormat("ru-RU", {
                  weekday: "short",
                  day: "numeric",
                  timeZone: "UTC",
                }).format(getCityDate(item, timezoneOffset))}
              </span>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
                className="forecast-icon"
              />
              <span className="forecast-description">
                {item.weather[0].description}
              </span>
              <strong className="forecast-temperature">
                {formatTemperature(item.main.temp, unit)}°{unit}
              </strong>
              <span className="forecast-rain">
                Осадки {Math.round(item.pop * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
