export type TemperatureUnit = "C" | "F";

export type WeatherLocation =
  | string
  | {
      lat: number;
      lon: number;
    };

export interface CurrentWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
  rain?: {
    "1h"?: number;
  };
  name: string;
  dt: number;
}

export interface ForecastItem {
  dt: number; // UNIX timestamp
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  visibility: number;
  pop: number; // вероятность осадков (0..1)
  dt_txt: string; // "2026-08-23 12:00:00"
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
