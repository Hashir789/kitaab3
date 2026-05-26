import { useState } from "react";
import Pagination from "./Pagination.tsx";
import { useMessagesTable } from "../hooks/useMessagesTable.ts";
import type { MessageRow } from "../api/visitors.ts";
import { formatDateTime } from "../lib/dates.ts";

const PAGE_SIZE = 10;

type Props = {
  onSelect?: (row: MessageRow) => void;
};

const MessagesTable = ({ onSelect }: Props) => {
  const [page, setPage] = useState(1);
  const { data, error, loading, refetch } = useMessagesTable({ page, limit: PAGE_SIZE });

  if (loading && !data) return <div className="muted">Loading…</div>;

  if (error) {
    return (
      <div className="error">
        <div>Failed to load messages: {error.message}</div>
        <button type="button" className="link" onClick={refetch}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { rows, total, limit } = data;
  const clickable = Boolean(onSelect);

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, row: MessageRow) => {
    if (!onSelect) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(row);
    }
  };

  const stop = (event: React.MouseEvent) => event.stopPropagation();

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
              <th>From</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Phone</th>
              <th>Received</th>
              {clickable && <th aria-label="Open details" className="chevron-col" />}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={clickable ? 6 : 5} className="table-empty muted">
                  No messages yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={clickable ? "is-clickable" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  role={clickable ? "button" : undefined}
                  aria-label={clickable ? `View details for message from ${row.name}` : undefined}
                  onClick={clickable ? () => onSelect?.(row) : undefined}
                  onKeyDown={clickable ? (e) => handleRowKeyDown(e, row) : undefined}
                >
                  <td>
                    <div className="cell-stack">
                      <span className="cell-primary">{row.name}</span>
                      <a
                        className="cell-secondary"
                        href={`mailto:${row.email}`}
                        onClick={stop}
                      >
                        {row.email}
                      </a>
                    </div>
                  </td>
                  <td>{row.subject}</td>
                  <td className="cell-message" title={row.message}>
                    {row.message}
                  </td>
                  <td>
                    {row.phone ? (
                      <a className="text-link" href={`tel:${row.phone}`} onClick={stop}>
                        {row.phone}
                      </a>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>{formatDateTime(row.created_at)}</td>
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

export default MessagesTable;
