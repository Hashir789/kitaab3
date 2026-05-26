import type { VisitorUser } from "../api/visitors.ts";
import { calculateAge, formatDateTime } from "../lib/dates.ts";

type Props = {
  data: VisitorUser[] | undefined;
  loading: boolean;
  error: Error | undefined;
  onRetry: () => void;
};

const VisitorUsers = ({ data, loading, error, onRetry }: Props) => {
  return (
    <section className="card">
      <h2 className="card-title">
        Users
        {data && data.length > 0 && (
          <span className="card-title-count">{data.length}</span>
        )}
      </h2>

      {loading && !data && <div className="muted">Loading…</div>}

      {error && !loading && (
        <div className="error">
          <div>Failed to load users: {error.message}</div>
          <button type="button" className="link" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="muted">No users associated with this visitor.</div>
      )}

      {data && data.length > 0 && (
        <ul className="users-list">
          {data.map((u) => (
            <li key={u.id} className="user-item">
              <div className="user-head">
                <div className="user-id">
                  <span className="user-id-label">User</span>
                  <code className="mono">#{u.id}</code>
                </div>
                <div className="user-badges">
                  <span
                    className={`badge${u.email_verified ? " badge-success" : " badge-muted"}`}
                  >
                    {u.email_verified ? "Email verified" : "Email unverified"}
                  </span>
                  <span
                    className={`badge${u.two_factor_enabled ? " badge-success" : " badge-muted"}`}
                  >
                    {u.two_factor_enabled ? "2FA on" : "2FA off"}
                  </span>
                </div>
              </div>

              <dl className="user-grid">
                <div className="user-field">
                  <dt>Gender</dt>
                  <dd className="capitalize">{u.gender}</dd>
                </div>
                <div className="user-field">
                  <dt>Age</dt>
                  <dd>{calculateAge(u.dob)}</dd>
                </div>
                <div className="user-field">
                  <dt>Last login</dt>
                  <dd>{formatDateTime(u.last_login_at)}</dd>
                </div>
                <div className="user-field">
                  <dt>Created</dt>
                  <dd>{formatDateTime(u.created_at)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default VisitorUsers;
