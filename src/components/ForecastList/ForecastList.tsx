import type { ForecastItem } from "../../types/types";

interface ForecastListProps {
  list: ForecastItem[];
}

export default function ForecastList({ list }: ForecastListProps) {
  return (
    <ul>
      {list.map((item) => (
        <li>{item.weather[0].description}</li>
      ))}
    </ul>
  );
}
