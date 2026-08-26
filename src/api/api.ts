import axios from "axios";
import type { CurrentWeatherResponse, ForecastResponse } from "../types/types";

const BASE_URL = "https://api.openweathermap.org";
const API_KEY = import.meta.env.VITE_WEATHER_MAP_API_KEY;

const weatherApi = axios.create({
  baseURL: `${BASE_URL}/data/2.5`,
  params: {
    APPID: API_KEY,
    lang: "ru",
    units: "metric",
  },
});

weatherApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    return Promise.reject(error); // Не забываем использовать catch() при вызове
  },
);

export async function currentWeatherApi(
  city: string,
): Promise<CurrentWeatherResponse> {
  const response = await weatherApi.get<CurrentWeatherResponse>("/weather", {
    params: {
      q: city,
    },
  });
  return response.data;
}

export async function forecastWeatherApi(
  city: string,
): Promise<ForecastResponse> {
  const request = await weatherApi.get<ForecastResponse>("/forecast", {
    params: {
      q: city,
    },
  });
  return request.data;
}
