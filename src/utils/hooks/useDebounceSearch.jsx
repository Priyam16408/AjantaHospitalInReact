import { useState, useEffect } from "react";

function useDebounceSearch(initialValue, delay) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, delay]);

  return [debouncedQuery, setSearchValue, searchValue];
}

export default useDebounceSearch;
