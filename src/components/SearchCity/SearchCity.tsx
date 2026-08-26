import { useState } from "react";

interface SearchCityProps {
  onSearch: (query: string) => void;
}

export default function SearchCity({ onSearch }: SearchCityProps) {
  const [query, setQuery] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query);
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите текст"
      />

      <button type="submit">Поиск</button>
    </form>
  );
}
