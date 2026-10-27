import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

function getPageItems(
  currentPage: number,
  pageCount: number,
  visibleCount: number,
): (number | "ellipsis")[] {
  if (pageCount <= 0) return [];

  const start = Math.max(
    2,
    Math.min(
      currentPage - Math.floor(visibleCount / 2),
      pageCount - visibleCount,
    ),
  );

  const end = Math.min(pageCount - 1, start + visibleCount - 1);

  const pages = new Set<number>([1, pageCount]);

  for (let page = start; page <= end; page++) {
    pages.add(page);
  }

  const sortedPages = [...pages].sort((a, b) => a - b);
  const items: (number | "ellipsis")[] = [];

  sortedPages.forEach((page, index) => {
    if (index > 0) {
      const gap = page - sortedPages[index - 1];

      if (gap === 2) {
        items.push(page - 1);
      } else if (gap > 2) {
        items.push("ellipsis");
      }
    }

    items.push(page);
  });

  return items;
}

function PageNumbers({
  items,
  currentPage,
  onPageChange,
  className,
}: {
  items: (number | "ellipsis")[];
  currentPage: number;
  onPageChange: (page: number) => void;
  className: string;
}) {
  return (
    <div className={className}>
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} aria-hidden="true" className="px-1">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Go to page ${item}`}
            aria-current={item === currentPage ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={`cursor-pointer px-2 py-1 ${
              item === currentPage ? "font-bold" : ""
            }`}
          >
            {item}
          </button>
        ),
      )}
    </div>
  );
}

export function Pagination({
  currentPage,
  pageCount,
  onPageChange,
}: PaginationProps) {
  const desktopPages = getPageItems(currentPage, pageCount, 5);
  const mobilePages = getPageItems(currentPage, pageCount, 3);

  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-1 sm:gap-4"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft aria-hidden="true" />
      </button>

      <PageNumbers
        items={mobilePages}
        currentPage={currentPage}
        onPageChange={onPageChange}
        className="flex items-center gap-1 sm:hidden"
      />

      <PageNumbers
        items={desktopPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
        className="hidden items-center gap-2 sm:flex"
      />

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage >= pageCount}
        onClick={() => onPageChange(currentPage + 1)}
        className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}
