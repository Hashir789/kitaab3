type Props = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
};

const DOTS = "…" as const;

type PageItem = number | typeof DOTS;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPages(current: number, totalPages: number, siblings: number): PageItem[] {
  const totalNumbers = siblings * 2 + 5;
  if (totalPages <= totalNumbers) return range(1, totalPages);

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = range(1, 3 + siblings * 2);
    return [...leftRange, DOTS, totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = range(totalPages - (3 + siblings * 2) + 1, totalPages);
    return [1, DOTS, ...rightRange];
  }

  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, totalPages];
}

const Pagination = ({
  page,
  pageSize,
  total,
  onChange,
  siblingCount = 1,
  disabled = false,
}: Props) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pages = buildPages(safePage, totalPages, siblingCount);

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination-info">
        {from}–{to} of {total}
      </span>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => onChange(safePage - 1)}
          disabled={disabled || safePage <= 1}
        >
          Previous
        </button>
        {pages.map((p, idx) =>
          p === DOTS ? (
            <span key={`dots-${idx}`} className="pagination-dots" aria-hidden="true">
              {DOTS}
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`pagination-btn${p === safePage ? " active" : ""}`}
              aria-current={p === safePage ? "page" : undefined}
              onClick={() => onChange(p)}
              disabled={disabled}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          className="pagination-btn"
          onClick={() => onChange(safePage + 1)}
          disabled={disabled || safePage >= totalPages}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
