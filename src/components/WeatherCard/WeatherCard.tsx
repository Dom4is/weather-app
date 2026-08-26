import type { CurrentWeatherResponse } from "../../types/types";

interface WeatherCardProps {
  currentWeather: CurrentWeatherResponse;
}

export default function WeatherCard({ currentWeather }: WeatherCardProps) {
  const toHumanDate = (notHumanDate: number) => {
    return new Date(notHumanDate * 1000).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "2-digit",
      weekday: "short",
      hourCycle: "h12",
      dayPeriod: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  console.log(toHumanDate(1726660758));

  return (
    <div>
      <img
        src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
        alt=""
      />
      <h1>{Math.round(currentWeather.main.temp)}° C </h1>
      <p>{toHumanDate(currentWeather.dt)}</p>
      <div>
        <p>Wind {currentWeather.wind.speed}</p>
        <p>Hum {currentWeather.main.humidity}</p>
        <p>Rain {currentWeather.rain?.["1h"] ?? 0} %</p>
      </div>
    </div>
  );
}
