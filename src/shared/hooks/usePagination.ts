import { useState } from "react";

export function usePagination<T>(items: readonly T[], pageSize = 5) {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * pageSize;
  const visibleItems = items.slice(firstIndex, firstIndex + pageSize);

  function goToPage(nextPage: number) {
    setPage(Math.max(1, Math.min(nextPage, pageCount)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { visibleItems, currentPage, pageCount, goToPage };
}
