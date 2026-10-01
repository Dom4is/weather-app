import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard/WeatherCard";
import { currentWeatherApi, forecastWeatherApi } from "../api/api";
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  TemperatureUnit,
  WeatherLocation,
} from "../types/types";
import SearchCity from "../components/SearchCity/SearchCity";
import ForecastList from "../components/ForecastList/ForecastList";

const RECENT_CITIES_KEY = "weather-recent-cities";
const FAVORITE_CITIES_KEY = "weather-favorite-cities";

function readCityList(key: string): string[] {
  try {
    const storedValue: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(storedValue)
      ? storedValue.filter((city): city is string => typeof city === "string")
      : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherResponse | null>(null);
  const [forecastWeather, setForecastWeather] =
    useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [recentCities, setRecentCities] = useState(() =>
    readCityList(RECENT_CITIES_KEY),
  );
  const [favoriteCities, setFavoriteCities] = useState(() =>
    readCityList(FAVORITE_CITIES_KEY),
  );

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(recentCities));
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }
  }, [recentCities]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favoriteCities));
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }
  }, [favoriteCities]);

  const loadWeather = async (location: WeatherLocation) => {
    setLoading(true);
    setError(null);

    try {
      const [weather, forecast] = await Promise.all([
        currentWeatherApi(location),
        forecastWeatherApi(location),
      ]);
      setCurrentWeather(weather);
      setForecastWeather(forecast);
      setRecentCities((cities) =>
        [
          weather.name,
          ...cities.filter(
            (city) =>
              city.toLocaleLowerCase() !== weather.name.toLocaleLowerCase(),
          ),
        ].slice(0, 5),
      );
    } catch {
      setError(
        "Не удалось найти этот город. Проверьте название и попробуйте снова.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => loadWeather(city);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается этим браузером.");
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        void loadWeather({ lat: coords.latitude, lon: coords.longitude });
      },
      () => {
        setLoading(false);
        setError(
          "Не удалось определить местоположение. Проверьте разрешение браузера.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const toggleFavorite = () => {
    if (!currentWeather) return;

    setFavoriteCities((cities) => {
      const isSaved = cities.some(
        (city) =>
          city.toLocaleLowerCase() === currentWeather.name.toLocaleLowerCase(),
      );
      return isSaved
        ? cities.filter(
            (city) =>
              city.toLocaleLowerCase() !==
              currentWeather.name.toLocaleLowerCase(),
          )
        : [currentWeather.name, ...cities];
    });
  };

  const isCurrentCityFavorite = currentWeather
    ? favoriteCities.some(
        (city) =>
          city.toLocaleLowerCase() === currentWeather.name.toLocaleLowerCase(),
      )
    : false;

  return (
    <main className="weather-app">
      <div className="page-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Погода, главная">
            <span className="brand-mark" aria-hidden="true">
              W
            </span>
            <span>Погода</span>
          </a>
          <span className="topbar-note">Погода в вашем городе</span>
          <SearchCity
            onSearch={handleSearch}
            onLocate={handleLocate}
            isLoading={loading}
            unit={unit}
            onUnitChange={setUnit}
          />
        </header>

        <section className="page-intro" aria-labelledby="page-title">
          <p className="eyebrow">ВАШ ЛИЧНЫЙ ПРОГНОЗ</p>
          <h1 id="page-title">Погода сегодня</h1>
          <p className="intro-copy">
            Узнайте, что происходит за окном и что взять с собой.
          </p>
        </section>

        {(favoriteCities.length > 0 || recentCities.length > 0) && (
          <nav className="city-shortcuts" aria-label="Сохранённые города">
            {favoriteCities.length > 0 && (
              <div className="shortcut-group">
                <span className="shortcut-label">ИЗБРАННОЕ</span>
                <div className="shortcut-list">
                  {favoriteCities.map((city) => (
                    <button
                      key={`favorite-${city}`}
                      type="button"
                      onClick={() => void handleSearch(city)}
                    >
                      <span aria-hidden="true">★</span>
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {recentCities.length > 0 && (
              <div className="shortcut-group">
                <span className="shortcut-label">НЕДАВНИЕ</span>
                <div className="shortcut-list">
                  {recentCities.map((city) => (
                    <button
                      key={`recent-${city}`}
                      type="button"
                      onClick={() => void handleSearch(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {currentWeather ? (
          <div className="weather-content" aria-live="polite">
            <WeatherCard
              currentWeather={currentWeather}
              unit={unit}
              isFavorite={isCurrentCityFavorite}
              onToggleFavorite={toggleFavorite}
            />
            <section
              className="forecast-section"
              aria-labelledby="forecast-title"
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">НЕСКОЛЬКО ДНЕЙ ВПЕРЁД</p>
                  <h2 id="forecast-title">Прогноз погоды</h2>
                </div>
                <span className="forecast-city">
                  {forecastWeather?.city.name}
                </span>
              </div>
              <ForecastList
                list={forecastWeather?.list ?? []}
                unit={unit}
                timezoneOffset={forecastWeather?.city.timezone ?? 0}
              />
            </section>
          </div>
        ) : (
          <section className="welcome-state" aria-live="polite">
            <div className="welcome-sun" aria-hidden="true">
              <span />
            </div>
            <p className="eyebrow">НАЧНИТЕ С ПОИСКА</p>
            <h2>{loading ? "Ищем ваш город..." : "Как там, за окном?"}</h2>
            <p>
              {loading
                ? "Собираем актуальный прогноз."
                : "Введите название города, чтобы увидеть актуальную погоду и прогноз."}
            </p>
          </section>
        )}

        <footer className="page-footer">
          Данные о погоде предоставлены OpenWeather
        </footer>
      </div>
    </main>
  );
}
