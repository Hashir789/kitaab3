import { useState } from "react";
import Pagination from "./Pagination.tsx";
import { useVisitorsTable } from "../hooks/useVisitorsTable.ts";
import type { VisitorRow } from "../api/visitors.ts";

const PAGE_SIZE = 10;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
};

type Props = {
  onSelect?: (row: VisitorRow) => void;
};

const VisitorsTable = ({ onSelect }: Props) => {
  const [page, setPage] = useState(1);
  const { data, error, loading, refetch } = useVisitorsTable({ page, limit: PAGE_SIZE });

  if (loading && !data) return <div className="muted">Loading…</div>;

  if (error) {
    return (
      <div className="error">
        <div>Failed to load visitors: {error.message}</div>
        <button type="button" className="link" onClick={refetch}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { rows, total, limit } = data;
  const clickable = Boolean(onSelect);

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, row: VisitorRow) => {
    if (!onSelect) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(row);
    }
  };

  return (
    <div className="table-wrap">
      <div className={`table-scroll${loading ? " is-loading" : ""}`} aria-busy={loading}>
        {loading && (
          <div className="table-overlay">
            <span className="spinner" aria-hidden="true" />
            <span>Loading…</span>
          </div>
        )}
        <table className="data-table">
          <thead>
            <tr>
              <th>Anonymous ID</th>
              <th>Device</th>
              <th>Timezone</th>
              <th className="num">Visits</th>
              <th className="num">Navigations</th>
              <th className="num">Clicks</th>
              <th>Last visited</th>
              {clickable && <th aria-label="Open details" className="chevron-col" />}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={clickable ? 8 : 7} className="table-empty muted">
                  No visitors yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={clickable ? "is-clickable" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  role={clickable ? "button" : undefined}
                  aria-label={clickable ? `View details for ${row.anonymous_id}` : undefined}
                  onClick={clickable ? () => onSelect?.(row) : undefined}
                  onKeyDown={clickable ? (e) => handleRowKeyDown(e, row) : undefined}
                >
                  <td>
                    <code className="mono">{row.anonymous_id}</code>
                  </td>
                  <td className="capitalize">{row.device_type}</td>
                  <td>{row.timezone}</td>
                  <td className="num">{row.number_of_visits}</td>
                  <td className="num">{row.navigations}</td>
                  <td className="num">{row.clicks}</td>
                  <td>{formatDate(row.last_visited)}</td>
                  {clickable && (
                    <td className="chevron-col" aria-hidden="true">
                      <span className="chevron">›</span>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        pageSize={limit}
        total={total}
        onChange={setPage}
        disabled={loading}
      />
    </div>
  );
};

export default VisitorsTable;
