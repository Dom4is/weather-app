import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard/WeatherCard";
import { currentWeatherApi, forecastWeatherApi } from "../api/api";
import type {
  CurrentWeatherResponse,
  ForecastItem,
  ForecastResponse,
} from "../types/types";
import SearchCity from "../components/SearchCity/SearchCity";
import ForecastList from "../components/ForecastList/ForecastList";

export default function HomePage() {
  const [currentWeather, setCurrentWeather] =
    useState<CurrentWeatherResponse | null>(null);
  const [forecastWeather, setForecastWeather] =
    useState<ForecastResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query: string) => {
    const weather = await currentWeatherApi(query);
    setCurrentWeather(weather);
    const forecast = await forecastWeatherApi(query);
    setForecastWeather(forecast);
  };
  return (
    <>
      <SearchCity onSearch={handleSearch} />
      {currentWeather && <WeatherCard currentWeather={currentWeather} />}
      <ForecastList list={forecastWeather?.list ?? []} />
    </>
  );
}
