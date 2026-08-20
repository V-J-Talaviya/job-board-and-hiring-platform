import { useState } from "react";

export function usePagedFilters<T extends object>(initial: T) {
  const [filters, setFilters] = useState(initial);
  const [page, setPage] = useState(1);

  function updateFilters(next: T) {
    setFilters(next);
    setPage(1);
  }

  return { filters, page, setPage, updateFilters };
}
