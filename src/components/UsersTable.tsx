import { useState } from "react";
import Pagination from "./Pagination.tsx";
import { useUsersTable } from "../hooks/useUsersTable.ts";
import type { UserRow } from "../api/users.ts";
import { calculateAge, formatDateTime } from "../lib/dates.ts";

const PAGE_SIZE = 10;

type Props = {
  onSelect?: (row: UserRow) => void;
};

const UsersTable = ({ onSelect }: Props) => {
  const [page, setPage] = useState(1);
  const { data, error, loading, refetch } = useUsersTable({ page, limit: PAGE_SIZE });

  if (loading && !data) return <div className="muted">Loading…</div>;

  if (error) {
    return (
      <div className="error">
        <div>Failed to load users: {error.message}</div>
        <button type="button" className="link" onClick={refetch}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { rows, total, limit } = data;
  const clickable = Boolean(onSelect);

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, row: UserRow) => {
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
              <th>ID</th>
              <th>Visitor</th>
              <th>Gender</th>
              <th className="num">Age</th>
              <th>Email</th>
              <th>2FA</th>
              <th>Last login</th>
              {clickable && <th aria-label="Open details" className="chevron-col" />}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={clickable ? 8 : 7} className="table-empty muted">
                  No users yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={clickable ? "is-clickable" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  role={clickable ? "button" : undefined}
                  aria-label={clickable ? `View details for user ${row.id}` : undefined}
                  onClick={clickable ? () => onSelect?.(row) : undefined}
                  onKeyDown={clickable ? (e) => handleRowKeyDown(e, row) : undefined}
                >
                  <td>
                    <code className="mono">#{row.id}</code>
                  </td>
                  <td>
                    <code className="mono">#{row.visitor_id}</code>
                  </td>
                  <td className="capitalize">{row.gender}</td>
                  <td className="num">{calculateAge(row.dob)}</td>
                  <td>
                    <span
                      className={`badge${row.email_verified ? " badge-success" : " badge-muted"}`}
                    >
                      {row.email_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge${row.two_factor_enabled ? " badge-success" : " badge-muted"}`}
                    >
                      {row.two_factor_enabled ? "On" : "Off"}
                    </span>
                  </td>
                  <td>{formatDateTime(row.last_login_at)}</td>
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

export default UsersTable;
