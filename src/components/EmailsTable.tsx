import { useState } from "react";
import Pagination from "./Pagination.tsx";
import { useEmailsTable } from "../hooks/useEmailsTable.ts";
import { formatDateTime } from "../lib/dates.ts";

const PAGE_SIZE = 10;

const EmailsTable = () => {
  const [page, setPage] = useState(1);
  const { data, error, loading, refetch } = useEmailsTable({ page, limit: PAGE_SIZE });

  if (loading && !data) return <div className="muted">Loading…</div>;

  if (error) {
    return (
      <div className="error">
        <div>Failed to load emails: {error.message}</div>
        <button type="button" className="link" onClick={refetch}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { rows, total, limit } = data;

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
              <th>Email</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2} className="table-empty muted">
                  No emails yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <a className="text-link" href={`mailto:${row.email}`} onClick={stop}>
                      {row.email}
                    </a>
                  </td>
                  <td>{formatDateTime(row.created_at)}</td>
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

export default EmailsTable;
